// src/components/Dashboard.jsx - Dashboard Component

import { useState, useEffect } from 'react';
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  searchFolders,
  uploadFile,
  getFilesByFolder,
  searchFiles,
  deleteFile
} from '../services/api';

function Dashboard({ user, userType, onLogout }) {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [folderName, setFolderName] = useState('');
  const [folderVisibility, setFolderVisibility] = useState(true);
  const [folderGroupId, setFolderGroupId] = useState('');
  
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderVisibility, setEditFolderVisibility] = useState(true);
  
  const [fileName, setFileName] = useState('');
  const [fileVisibility, setFileVisibility] = useState(true);
  const [fileGroupId, setFileGroupId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [availableGroups, setAvailableGroups] = useState([]);

  useEffect(() => {
    loadFolders();
    // Set available groups based on user type
    if (userType === 'supervisor') {
      setAvailableGroups(user.groups || []);
      setFolderGroupId(user.groups?.[0] || '');
      setFileGroupId(user.groups?.[0] || '');
    } else {
      setAvailableGroups([user.Group_id]);
      setFolderGroupId(user.Group_id);
      setFileGroupId(user.Group_id);
    }
  }, []);

  const loadFolders = async () => {
    try {
      const response = await getFolders(user.Gmail);
      setFolders(response.data);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const loadFiles = async (folderId) => {
    try {
      const response = await getFilesByFolder(folderId, user.Gmail);
      setFiles(response.data);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      await createFolder({
        Name: folderName,
        Visibility: folderVisibility,
        ownerEmail: user.Gmail,
        Group_id: folderGroupId
      });
      setFolderName('');
      setShowCreateFolder(false);
      loadFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert(error.response?.data?.message || 'Error creating folder');
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Name', fileName);
      formData.append('Folder', selectedFolder.id);
      formData.append('Visibility', fileVisibility);
      formData.append('ownerEmail', user.Gmail);
      formData.append('Group_id', fileGroupId);
      formData.append('file', selectedFile);

      await uploadFile(formData);
      setFileName('');
      setSelectedFile(null);
      setShowUploadFile(false);
      loadFiles(selectedFolder.id);
      loadFolders();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error.response?.data?.message || 'Error uploading file');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadFolders();
      setSelectedFolder(null);
      setFiles([]);
      return;
    }
    try {
      const folderResponse = await searchFolders(searchQuery, user.Gmail);
      const fileResponse = await searchFiles(searchQuery, user.Gmail);
      
      setFolders(folderResponse.data);
      
      // If files are found, display them
      if (fileResponse.data.length > 0) {
        setFiles(fileResponse.data);
        setSelectedFolder({ Name: 'Search Results', id: 'search' });
      } else {
        setFiles([]);
        setSelectedFolder(null);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleDeleteFolder = async (id) => {
    if (window.confirm('Delete this folder?')) {
      try {
        await deleteFolder(id);
        loadFolders();
        setSelectedFolder(null);
        setFiles([]);
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setEditFolderName(folder.Name);
    setEditFolderVisibility(folder.Visibility);
    setShowEditFolder(true);
  };

  const handleUpdateFolder = async (e) => {
    e.preventDefault();
    try {
      await updateFolder(editingFolder.id, {
        Name: editFolderName,
        Visibility: editFolderVisibility
      });
      setShowEditFolder(false);
      loadFolders();
      if (selectedFolder && selectedFolder.id === editingFolder.id) {
        setSelectedFolder({
          ...editingFolder,
          Name: editFolderName,
          Visibility: editFolderVisibility
        });
      }
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDownloadFile = (fileId) => {
    window.open(`http://localhost:9222/api/files/download/${fileId}`, '_blank');
  };

  const handleDeleteFile = async (id) => {
    if (window.confirm('Delete this file?')) {
      try {
        await deleteFile(id);
        loadFiles(selectedFolder.id);
        loadFolders();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    loadFiles(folder.id);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F3FA' }}>
      {/* Header */}
      <div style={{
        background: '#638ECB',
        padding: '20px 40px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>File Management System</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            Welcome, {user.Name} ({userType})
          </p>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '10px 20px',
            background: '#395886',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Search and Actions Bar */}
      <div style={{
        padding: '20px 40px',
        background: '#D5DEEF',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #B1C9EF',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '12px 24px',
            background: '#8AAEE0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
        <button
          onClick={() => setShowCreateFolder(true)}
          style={{
            padding: '12px 24px',
            background: '#638ECB',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          New Folder
        </button>
        {selectedFolder && (
          <button
            onClick={() => setShowUploadFile(true)}
            style={{
              padding: '12px 24px',
              background: '#395886',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Upload File
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 140px)' }}>
        {/* Folders List */}
        <div style={{
          width: '350px',
          background: 'white',
          padding: '20px',
          borderRight: '2px solid #D5DEEF',
          overflowY: 'auto'
        }}>
          <h3 style={{ color: '#395886', marginTop: 0 }}>Folders</h3>
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              style={{
                padding: '15px',
                background: selectedFolder?.id === folder.id ? '#B1C9EF' : '#F0F3FA',
                marginBottom: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#395886' }}>
                    📁 {folder.Name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#638ECB', marginTop: '5px' }}>
                    {folder.File} files • {folder.Visibility ? '🌐 Public' : '🔒 Private'} • Group {folder.Group_id}
                  </div>
                </div>
                {folder.ownerEmail === user.Gmail && (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFolder(folder);
                      }}
                      style={{
                        padding: '5px 10px',
                        background: '#8AAEE0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      style={{
                        padding: '5px 10px',
                        background: '#d9534f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Files List */}
        <div style={{ flex: 1, padding: '20px 40px' }}>
          {selectedFolder ? (
            <>
              <h3 style={{ color: '#395886' }}>
                Files in "{selectedFolder.Name}"
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {files.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      padding: '20px',
                      background: 'white',
                      borderRadius: '8px',
                      border: '2px solid #D5DEEF'
                    }}
                  >
                    <div style={{ fontSize: '32px', textAlign: 'center', marginBottom: '10px' }}>
                      📄
                    </div>
                    <div style={{ fontWeight: '600', color: '#395886', marginBottom: '8px' }}>
                      {file.Name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#638ECB', marginBottom: '10px' }}>
                      {file.Visibility ? '🌐 Public' : '🔒 Private'}
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => handleDownloadFile(file.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          background: '#8AAEE0',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Download
                      </button>
                      {file.ownerEmail === user.Gmail && (
                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            background: '#d9534f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#8AAEE0',
              fontSize: '18px'
            }}>
              Select a folder to view files
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3 style={{ color: '#395886', marginTop: 0 }}>Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#395886' }}>
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #D5DEEF',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', color: '#395886' }}>
                  <input
                    type="checkbox"
                    checked={folderVisibility}
                    onChange={(e) => setFolderVisibility(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Public Folder
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#395886' }}>
                  Select Group
                </label>
                <select
                  value={folderGroupId}
                  onChange={(e) => setFolderGroupId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #D5DEEF',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                >
                  {availableGroups.map(group => (
                    <option key={group} value={group}>Group {group}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#638ECB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateFolder(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#D5DEEF',
                    color: '#395886',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3 style={{ color: '#395886', marginTop: 0 }}>Upload File</h3>
            <form onSubmit={handleUploadFile}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#395886' }}>
                  File Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #D5DEEF',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#395886' }}>
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #D5DEEF',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', color: '#395886' }}>
                  <input
                    type="checkbox"
                    checked={fileVisibility}
                    onChange={(e) => setFileVisibility(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Public File
                </label>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#395886' }}>
                  Select Group
                </label>
                <select
                  value={fileGroupId}
                  onChange={(e) => setFileGroupId(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #D5DEEF',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                >
                  {availableGroups.map(group => (
                    <option key={group} value={group}>Group {group}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#638ECB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadFile(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#D5DEEF',
                    color: '#395886',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Folder Modal */}
      {showEditFolder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3 style={{ color: '#395886', marginTop: 0 }}>Edit Folder</h3>
            <form onSubmit={handleUpdateFolder}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#395886' }}>
                  Folder Name
                </label>
                <input
                  type="text"
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #D5DEEF',
                    borderRadius: '6px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', color: '#395886' }}>
                  <input
                    type="checkbox"
                    checked={editFolderVisibility}
                    onChange={(e) => setEditFolderVisibility(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Public Folder
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#638ECB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditFolder(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#D5DEEF',
                    color: '#395886',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;