import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";

const BASE_URL = "https://6413-115-245-115-222.ngrok-free.app";

const FileManager = () => {
  const [blocks, setBlocks] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [globalLoading, setGlobalLoading] = useState(false);
  const [folderLoading, setFolderLoading] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filesInFolder, setFilesInFolder] = useState([]);
  const [fileName, setFileName] = useState("");

  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/fetch-all-folders`, { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        const foldersFromServer = data.folders.map((folderName, index) => ({
          id: index + 2,
          name: folderName,
          isRoot: folderName === "Root",
          files: [],
          editing: false,
          tempName: folderName,
        }));
        setBlocks([
          { id: 1, name: "Root", isRoot: true, files: [], editing: false, tempName: "Root" },
          ...foldersFromServer,
        ]);
      } else {
        toast.error(data.error || "Failed to fetch folders");
      }
    } catch (error) {
      toast.error("Server error fetching folders");
    }
  };

  const addFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/add-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_name: newFolderName }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Folder created!");
        setNewFolderName("");
        await fetchFolders();
      } else {
        toast.error(data.error || "Error creating folder");
      }
    } catch (error) {
      toast.error("Error creating folder");
    }
  };

  const startEditing = (id) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, editing: true } : block));
  };

  const cancelEditing = (id) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, editing: false, tempName: block.name } : block));
  };

  const handleRename = async (id) => {
    const block = blocks.find((b) => b.id === id);
    if (block.isRoot) return;
    try {
      const response = await fetch(`${BASE_URL}/edit-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_name: block.name, filename: block.tempName }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Folder renamed!");
        await fetchFolders();
      } else {
        toast.error(data.error || "Error renaming folder");
      }
    } catch (error) {
      toast.error("Error renaming folder");
    }
  };

  const askDeleteFolder = (id) => {
    const block = blocks.find((b) => b.id === id);
    setFolderToDelete(block);
    setShowModal(true);
  };

  const confirmDeleteFolder = async () => {
    const block = folderToDelete;
    if (!block) return;
    try {
      const response = await fetch(`${BASE_URL}/delete-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_name: block.name }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Folder deleted!");
        await fetchFolders();
      } else {
        toast.error(data.error || "Error deleting folder");
      }
    } catch (error) {
      toast.error("Error deleting folder");
    }
    setShowModal(false);
    setFolderToDelete(null);
  };

  const uploadFile = async (blockId) => {
    const block = blocks.find((b) => b.id === blockId);
    const file = document.getElementById("fileInput").files[0];
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("folder_name", block.name);
      formData.append("file", file);

      const response = await fetch(`${BASE_URL}/upload-file-in-folder`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("File uploaded!");
        await fetchFolders();
      } else {
        toast.error(data.error || "Error uploading file");
      }
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  // Debounced Search Handler
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Clear the previous debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout to call the search function after a delay
    debounceTimeout.current = setTimeout(() => {
      if (query.trim()) {
        handleGlobalSearch(query);  // Only search if query is not empty
      } else {
        setSearchResults([]);
        setDropdownOpen(false);  // Close dropdown when query is empty
      }
    }, 500); // Wait 500ms after the user stops typing
  };

  // Global search handler
  const handleGlobalSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setDropdownOpen(false);  // Close dropdown if query is empty
      return;
    }

    setGlobalLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/search-files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_name: query }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.files.length > 0) {
          setSearchResults(data.files);
          setDropdownOpen(true);  // Open dropdown if results are found
        } else {
          setSearchResults([]);
          setDropdownOpen(false);  // Close dropdown if no results
          toast.error("No matching files found");
        }
      } else {
        setSearchResults([]);
        setDropdownOpen(false);  // Close dropdown on error
        toast.error(data.error || "Error searching files");
      }
    } catch (error) {
      setSearchResults([]);
      setDropdownOpen(false);  // Close dropdown on error
      toast.error("Error searching files");
    }
    setGlobalLoading(false);
  };

  const fetchAllFilesInFolder = async (blockId) => {
    const block = blocks.find((b) => b.id === blockId);
    setFolderLoading((prev) => ({ ...prev, [blockId]: true }));
    try {
      const response = await fetch(`${BASE_URL}/fetch-files-in-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_name: block.name }),
      });
      const data = await response.json();
      if (response.ok) {
        setFilesInFolder((prev) => ({ ...prev, [blockId]: data.files }));
        setDropdownOpen(false);
      } else {
        toast.error(data.error || "Error fetching files");
      }
    } catch (error) {
      toast.error("Error fetching files");
    }
    setFolderLoading((prev) => ({ ...prev, [blockId]: false }));
  };

  const handleDownload = (fileName) => {
    const fileUrl = `${BASE_URL}/download-file?filename=${fileName}`;
    window.location.href = fileUrl;
  };

  return (
    <div style={styles.wrapper}>
      <Toaster position="top-right" reverseOrder={false} />

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Confirm Deletion</h2>
            <p>Delete folder "<b>{folderToDelete?.name}</b>"?</p>
            <div style={styles.modalButtons}>
              <button onClick={confirmDeleteFolder} style={styles.confirmDeleteBtn}>Yes, Delete</button>
              <button onClick={() => setShowModal(false)} style={styles.cancelDeleteBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <h1 style={styles.title}>📁 SRD File Manager</h1>

      <div style={styles.addFolderWrapper}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          style={styles.input}
        />
        <button onClick={addFolder} style={styles.addFolderButton}>
          Add Folder
        </button>
      </div>

      <div style={styles.searchWrapper}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search files globally..."
            style={styles.searchInput}
            ref={searchRef}
          />
          <button 
            onClick={() => handleGlobalSearch(searchQuery)} 
            style={styles.searchButton}
            disabled={globalLoading}
          >
            {globalLoading ? "Searching..." : "Search"}
          </button>

          {dropdownOpen && searchResults.length > 0 && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                Found {searchResults.length} results
              </div>
              {searchResults.map((file, idx) => (
                <div key={idx} style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  <span style={styles.fileName}>{file}</span>
                  <button 
                    onClick={() => handleDownload(file)} 
                    style={styles.downloadButton}
                    title="Download"
                  >
                    ⬇️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={styles.blocksContainer}>
        {blocks.map((block) => (
          <div key={block.id} style={styles.block}>
            <div style={styles.blockHeader}>
              {block.editing ? (
                <>
                  <input
                    type="text"
                    value={block.tempName}
                    onChange={(e) =>
                      setBlocks(blocks.map((b) =>
                        b.id === block.id ? { ...b, tempName: e.target.value } : b
                      ))
                    }
                    style={styles.blockTitleInput}
                  />
                  <div style={styles.actions}>
                    <button onClick={() => handleRename(block.id)} style={styles.saveButton}>✅</button>
                    <button onClick={() => cancelEditing(block.id)} style={styles.cancelButton}>✖️</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={styles.blockTitle}>{block.name}</h3>
                  {!block.isRoot && (
                    <div style={styles.actions}>
                      <button onClick={() => startEditing(block.id)} style={styles.editButton}>✏️</button>
                      <button onClick={() => askDeleteFolder(block.id)} style={styles.deleteButton}>🗑️</button>
                    </div>
                  )}
                </>
              )}
            </div>

            <input
              type="file"
              onChange={(e) => uploadFile(block.id, e.target.files[0])}
              style={styles.fileInput}
            />

            <button
              onClick={() => fetchAllFilesInFolder(block.id)}
              style={styles.fetchButton}
              disabled={folderLoading[block.id]}
            >
              {folderLoading[block.id] ? "Fetching..." : "Fetch All Files"}
            </button>

            <div style={styles.fileList}>
              {filesInFolder[block.id] && filesInFolder[block.id].length === 0 ? (
                <p style={styles.noFiles}>No files in this folder</p>
              ) : (
                filesInFolder[block.id]?.map((file, idx) => (
                  <div key={idx} style={styles.fileItem}>
                    <span style={styles.fileName}>{file}</span>
                    <button 
                      onClick={() => handleDownload(file)} 
                      style={styles.downloadButton}
                    >
                      Download
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { 
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", 
    minHeight: "100vh", 
    padding: "20px", 
    fontFamily: "'Poppins', sans-serif", 
    color: "white" 
  },
  title: { 
    textAlign: "center", 
    marginBottom: "30px", 
    fontSize: "32px", 
    fontWeight: "bold" 
  },
  addFolderWrapper: { 
    display: "flex", 
    justifyContent: "center", 
    marginBottom: "20px", 
    gap: "10px", 
    flexWrap: "wrap" 
  },
  searchWrapper: { 
    display: "flex", 
    justifyContent: "center", 
    marginBottom: "30px",
    position: 'relative'
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    display: 'flex'
  },
  input: { 
    padding: "12px", 
    width: "220px", 
    borderRadius: "10px", 
    border: "1px solid #ccc", 
    backgroundColor: "#ffffff20", 
    color: "white", 
    outline: "none" 
  },
  addFolderButton: { 
    padding: "12px 24px", 
    backgroundColor: "#4CAF50", 
    border: "none", 
    borderRadius: "10px", 
    fontWeight: "bold", 
    color: "white", 
    cursor: "pointer",
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#45a049'
    }
  },
  searchInput: { 
    padding: "12px",
    flex: 1,
    borderRadius: "8px 0 0 8px",
    border: "none",
    backgroundColor: "#ffffff20",
    color: "white",
    outline: "none",
    fontSize: '16px'
  },
  searchButton: { 
    padding: "12px 24px", 
    backgroundColor: "#2196F3", 
    border: "none", 
    borderRadius: "0 8px 8px 0", 
    fontWeight: "bold", 
    color: "white", 
    cursor: "pointer",
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#1976D2'
    }
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: "#2c5364",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    marginTop: "8px",
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto'
  },
  dropdownHeader: {
    padding: "12px",
    fontWeight: "bold",
    borderBottom: "1px solid #ffffff20",
    backgroundColor: '#203a43',
    position: 'sticky',
    top: 0
  },
  dropdownItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    cursor: "pointer",
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#ffffff10'
    }
  },
  fileName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginRight: '10px'
  },
  downloadButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4CAF50',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#4CAF5020'
    }
  },
  blocksContainer: { 
    display: "flex", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    gap: "20px" 
  },
  block: { 
    backgroundColor: "#ffffff15", 
    padding: "20px", 
    borderRadius: "16px", 
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)", 
    width: "300px", 
    display: "flex", 
    flexDirection: "column", 
    backdropFilter: "blur(10px)" 
  },
  blockHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "10px" 
  },
  blockTitle: { 
    fontSize: "20px", 
    fontWeight: "bold" 
  },
  blockTitleInput: { 
    flex: 1, 
    padding: "8px", 
    fontSize: "16px", 
    borderRadius: "8px", 
    border: "1px solid #ccc", 
    backgroundColor: "#ffffff20", 
    color: "white", 
    outline: "none" 
  },
  actions: { 
    display: "flex", 
    gap: "6px" 
  },
  saveButton: { 
    backgroundColor: "#28a745", 
    border: "none", 
    padding: "6px", 
    borderRadius: "50%", 
    cursor: "pointer", 
    color: "white" 
  },
  cancelButton: { 
    backgroundColor: "#dc3545", 
    border: "none", 
    padding: "6px", 
    borderRadius: "50%", 
    cursor: "pointer", 
    color: "white" 
  },
  editButton: { 
    backgroundColor: "#ffc107", 
    border: "none", 
    padding: "6px", 
    borderRadius: "50%", 
    cursor: "pointer", 
    color: "white" 
  },
  deleteButton: { 
    backgroundColor: "#e74c3c", 
    border: "none", 
    padding: "6px", 
    borderRadius: "50%", 
    cursor: "pointer", 
    color: "white" 
  },
  fetchButton: { 
    marginTop: "10px", 
    padding: "8px 16px", 
    backgroundColor: "#17a2b8", 
    border: "none", 
    borderRadius: "10px", 
    fontWeight: "bold", 
    color: "white", 
    cursor: "pointer",
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#138496'
    }
  },
  fileInput: { 
    marginBottom: "10px" 
  },
  fileList: { 
    flex: 1, 
    marginTop: "10px" 
  },
  fileItem: { 
    fontSize: "14px", 
    padding: "8px 0", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  noFiles: { 
    textAlign: "center", 
    color: "#aaa", 
    marginTop: "10px" 
  },
  modalOverlay: { 
    position: "fixed", 
    top: "0", 
    left: "0", 
    right: "0", 
    bottom: "0", 
    backgroundColor: "rgba(0,0,0,0.6)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    zIndex: "1000" 
  },
  modal: { 
    backgroundColor: "#fff", 
    padding: "30px", 
    borderRadius: "16px", 
    width: "90%", 
    maxWidth: "400px", 
    textAlign: "center", 
    color: "#333" 
  },
  modalButtons: { 
    marginTop: "20px", 
    display: "flex", 
    justifyContent: "space-around" 
  },
  confirmDeleteBtn: { 
    backgroundColor: "#e74c3c", 
    color: "white", 
    padding: "10px 20px", 
    border: "none", 
    borderRadius: "8px", 
    fontWeight: "bold", 
    cursor: "pointer" 
  },
  cancelDeleteBtn: { 
    backgroundColor: "#6c757d", 
    color: "white", 
    padding: "10px 20px", 
    border: "none", 
    borderRadius: "8px", 
    fontWeight: "bold", 
    cursor: "pointer" 
  }
};

export default FileManager;
