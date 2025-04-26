// src/services/api.js

export const addFolder = async (folderName) => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/add-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error adding folder' };
    }
  };
  
  export const uploadFile = async (folderName, file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(`https://6413-115-245-115-222.ngrok-free.app/upload-file-in-folder`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error uploading file' };
    }
  };
  
  export const fetchFilesInFolder = async (folderName) => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/fetch-files-in-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error fetching files in folder' };
    }
  };
  
  export const fetchAllFiles = async () => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/fetch-all-files', {
        method: 'POST',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error fetching all files' };
    }
  };
  
  export const searchFiles = async (searchQuery) => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/search-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: searchQuery }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error searching files' };
    }
  };
  
  export const editFolder = async (folderName, newFolderName) => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/edit-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName, filename: newFolderName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error editing folder' };
    }
  };
  
  export const deleteFile = async (folderName, filename) => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/delete-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName, filename: filename }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error deleting file' };
    }
  };
  
  export const deleteFolder = async (folderName) => {
    try {
      const response = await fetch('https://6413-115-245-115-222.ngrok-free.app/delete-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder_name: folderName }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      return { error: 'Error deleting folder' };
    }
  };
  