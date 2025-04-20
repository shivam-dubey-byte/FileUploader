import React, { useState } from "react";

const FileManager = () => {
  const BASE_URL = "https://c188-115-245-115-222.ngrok-free.app";

  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 10;

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(`\u2705 Uploaded: ${result.path}`);
        setFile(null);
      } else {
        setMessage(`\u274C Error: ${result.error}`);
      }
    } catch (err) {
      setMessage("\u274C Upload failed");
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/list-files`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files);
        setMessage("\ud83d\udcc2 File list fetched.");
        setCurrentPage(1);
      } else {
        setMessage("\u274C Could not fetch file list.");
      }
    } catch (err) {
      setMessage("\u274C Server error.");
    }
  };

  const downloadFile = async (targetFile) => {
    try {
      const res = await fetch(`${BASE_URL}/file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: targetFile }),
      });

      if (!res.ok) {
        alert("\u274C File not found or download failed.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = targetFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      alert("\u274C Download error.");
    }
  };

  const filteredFiles = files.filter((f) => f.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  const startIdx = (currentPage - 1) * filesPerPage;
  const paginatedFiles = filteredFiles.slice(startIdx, startIdx + filesPerPage);

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.header}>SRD File Manager</h1>

        <div style={styles.section}>
          <label htmlFor="fileInput" style={styles.fileLabel}>Choose File</label>
          <input id="fileInput" type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.hiddenFileInput} />
          <button onClick={uploadFile} style={styles.buttonPrimary}>Upload</button>
        </div>

        <div style={styles.section}>
          <input
            type="text"
            placeholder="Enter filename to download"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            style={styles.input}
          />
          <button onClick={() => downloadFile(filename)} style={styles.buttonOutline}>Download</button>
        </div>

        <div style={styles.section}>
          <button onClick={fetchFiles} style={styles.buttonGhost}>List All Files</button>
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
          <div style={styles.fileList}>
            {paginatedFiles.map((f) => (
              <div key={f} style={styles.fileCard}>
                <div style={styles.fileName}>{f}</div>
                <button onClick={() => downloadFile(f)} style={styles.downloadBtn}>Download</button>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1} style={styles.pageButton}>&laquo;</button>
              <span style={{ color: "#eee" }}>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} style={styles.pageButton}>&raquo;</button>
            </div>
          )}
        </div>

        <div style={styles.message}>{message}</div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "550px",
    backgroundColor: "#ffffff10",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    color: "white",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  },
  header: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#f5f5f5",
  },
  section: {
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  hiddenFileInput: {
    display: "none",
  },
  fileLabel: {
    padding: "10px",
    border: "1px dashed #aaa",
    borderRadius: "10px",
    backgroundColor: "#ffffff22",
    color: "#f9f9f9",
    textAlign: "center",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  buttonPrimary: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    color: "white",
    padding: "10px",
    border: "1px solid white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  buttonGhost: {
    backgroundColor: "#ffffff10",
    color: "white",
    padding: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  fileList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "200px",
    overflowY: "auto",
    padding: "5px 0",
  },
  fileCard: {
    backgroundColor: "#ffffff15",
    borderRadius: "10px",
    padding: "10px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  fileName: {
    color: "#e0f7fa",
    fontWeight: "500",
  },
  downloadBtn: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  pageButton: {
    backgroundColor: "#ffffff15",
    border: "none",
    color: "white",
    padding: "6px 12px",
    margin: "0 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15px",
    gap: "10px",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    fontWeight: "bold",
  },
};

export default FileManager;