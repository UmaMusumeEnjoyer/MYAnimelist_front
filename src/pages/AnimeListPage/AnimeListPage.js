// src/pages/AnimeList/AnimeListPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import AnimeCard from '../../components/AnimeCard';
import Sidebar from './components/Sidebar';
import AddAnimeModal from './components/AddAnimeModal'; 

import { collaborators } from '../../data/mockDataSearchPage';
import { 
  getCustomListItems, 
  getAnimeById, 
  addAnimeToCustomList, 
  deleteCustomList,
  getListMembers,   
  updateCustomList,
  removeAnimeFromCustomList // <--- [CẬP NHẬT 1] Import API xóa
} from '../../services/api'; 
import './AnimeListPage.css';

const AnimeListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); 
  const currentUsername = localStorage.getItem("username");
  
  const [listInfo, setListInfo] = useState(location.state?.listData || {
    list_name: "Loading...",
    description: "",
    is_private: false,
    color: "#3db4f2", 
    is_owner: false
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    list_name: "",
    description: "",
    is_private: false,
    color: "#000000"
  });

  const [groupedAnime, setGroupedAnime] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // --- [CẬP NHẬT 2] State cho chức năng Delete ---
  const [deleteMode, setDeleteMode] = useState(false); // Bật/tắt chế độ xóa
  const [selectedAnimeIds, setSelectedAnimeIds] = useState([]); // Danh sách ID anime đang chọn
  const [isDeleting, setIsDeleting] = useState(false); // Loading khi đang gọi API xóa

  // --- 1. CHECK PERMISSIONS ---
  const fetchUserPermissions = useCallback(async () => {
    if (!id || !currentUsername) return;
    try {
      const res = await getListMembers(id);
      const { members } = res.data; 
      const currentUserData = members.find(m => m.username === currentUsername);

      if (currentUserData) {
        localStorage.setItem("permission_level", currentUserData.permission_level);
        setListInfo(prev => ({ ...prev, is_owner: currentUserData.is_owner }));
      } else {
        localStorage.removeItem("permission_level");
        setListInfo(prev => ({ ...prev, is_owner: false }));
      }
    } catch (error) {
      console.error("Failed to fetch list members:", error);
    }
  }, [id, currentUsername]);

  // --- 2. FETCH LIST DETAILS ---
  const fetchListDetails = useCallback(() => {
    if (!id) return;
    
    // Khi refresh list, reset lại chế độ xóa
    setDeleteMode(false);
    setSelectedAnimeIds([]);

    getCustomListItems(id)
      .then(async (res) => {
        const data = res.data;
        
        setListInfo(prev => ({
          ...prev, 
          list_name: data.list_name || prev.list_name,
          description: data.description !== undefined ? data.description : prev.description,
          is_private: data.is_private !== undefined ? data.is_private : prev.is_private,
          color: data.color || prev.color 
        }));

        const items = data.anime_items || [];
        const detailedPromises = items.map((item) => 
          getAnimeById(item.anilist_id)
            .then((animeRes) => ({
                ...animeRes.data,
                _added_by: item.added_by, // Quan trọng: dùng để phân nhóm
                _added_date: item.added_date,
                _note: item.note,
                _anilist_id: item.anilist_id // Lưu ID gốc để xóa
              }))
            .catch((err) => {
              console.error(`Failed to load anime ${item.anilist_id}`, err);
              return null;
            })
        );

        const detailedAnimeList = await Promise.all(detailedPromises);
        const groups = {};
        detailedAnimeList.forEach((anime) => {
          if (anime) {
            const user = anime._added_by || "Unknown";
            if (!groups[user]) groups[user] = [];
            groups[user].push(anime);
          }
        });
        setGroupedAnime(groups);
      })
      .catch((err) => console.error("Error fetching list data:", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchListDetails();     
    fetchUserPermissions(); 
  }, [fetchListDetails, fetchUserPermissions]);

  // --- [CẬP NHẬT 3] Handlers cho chức năng Delete ---

  // Bật/Tắt chế độ Delete
  const toggleDeleteMode = () => {
    if (deleteMode) {
      // Nếu đang bật mà tắt -> Cancel -> Reset selection
      setSelectedAnimeIds([]);
    }
    setDeleteMode(!deleteMode);
  };

  // Chọn/Bỏ chọn Anime
  const handleSelectAnime = (anilistId) => {
    if (!deleteMode) return; // Chỉ chọn được khi ở delete mode

    setSelectedAnimeIds(prev => {
      if (prev.includes(anilistId)) {
        return prev.filter(id => id !== anilistId);
      } else {
        return [...prev, anilistId];
      }
    });
  };

  // Thực hiện Xóa (Nút Confirm)
  const handleConfirmDelete = async () => {
    // Nếu chưa chọn gì thì không làm gì cả
    if (selectedAnimeIds.length === 0) {
      return;
    }

    // Bắt đầu xóa ngay lập tức
    setIsDeleting(true);
    try {
      // Xóa song song tất cả các item đã chọn
      const deletePromises = selectedAnimeIds.map(anilistId => 
        removeAnimeFromCustomList(id, anilistId)
      );

      await Promise.all(deletePromises);
      
      // Xóa xong -> Refresh data
      fetchListDetails(); 
      // alert("Removed successfully!"); // Có thể bỏ luôn alert này nếu muốn giao diện hoàn toàn im lặng
    } catch (error) {
      console.error("Failed to remove anime:", error);
      alert("Some items could not be removed."); // Chỉ hiện thông báo nếu có lỗi
    } finally {
      setIsDeleting(false);
      setDeleteMode(false); // Tắt chế độ xóa
      setSelectedAnimeIds([]); // Reset danh sách chọn
    }
  };


  // --- HANDLERS CŨ ---
  const handleEditListClick = () => { /* ... giữ nguyên ... */ 
    const permissionLevel = localStorage.getItem("permission_level");
    if (permissionLevel !== "owner") {
      alert("You do not have permission to edit this list.");
      return;
    }
    setEditFormData({
      list_name: listInfo.list_name || "",
      description: listInfo.description || "",
      is_private: listInfo.is_private || false,
      color: listInfo.color || "#3db4f2"
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => { /* ... giữ nguyên ... */ 
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEdit = async (e) => { /* ... giữ nguyên ... */ 
    e.preventDefault();
    try {
      await updateCustomList(id, editFormData);
      setListInfo(prev => ({
        ...prev,
        list_name: editFormData.list_name,
        description: editFormData.description,
        is_private: editFormData.is_private,
        color: editFormData.color
      }));
      alert("List details updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update list:", error);
      alert("An error occurred while updating the list.");
    }
  };

  const handleDeleteList = async () => { /* ... giữ nguyên ... */
    if (window.confirm("Are you sure you want to delete this list? This action cannot be undone.")) {
      try {
        await deleteCustomList(id);
        alert("List deleted successfully!");
        navigate(-1); 
      } catch (error) {
        console.error("Failed to delete list:", error);
        alert("An error occurred while deleting the list.");
      }
    }
  };

  const handleAddAnime = async (anime) => { /* ... giữ nguyên ... */
    try {
      const payload = {
        anilist_id: anime.anilist_id || anime.media?.id || anime.id,
        note: ""
      };
      await addAnimeToCustomList(id, payload);
      fetchListDetails();
    } catch (error) {
      console.error("Failed to add anime:", error);
      throw error; 
    }
  };

  const filterAnime = (list) => { /* ... giữ nguyên ... */
    if (!searchTerm) return list;
    return list.filter(anime => {
      const title = anime.title_romaji || anime.title_english || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };
  
  // --- RENDER ---
  return (
    <div className="page-container">
      <div className="main-layout">
        
        <main className="content-area">
          <div className="page-header">
            {/* ... Giữ nguyên phần Header text ... */}
            <div className="header-text">
              <h1 className="page-title">{listInfo.list_name}</h1>
              {listInfo.description && (
                <p className="page-description" style={{ whiteSpace: 'pre-line', marginTop: '8px' }}>
                  {listInfo.description}
                </p>
              )}
              {listInfo.is_private && (
                <div style={{marginTop: '8px'}}>
                  <span className="count-badge" style={{background: '#ef4444', color:'white'}}>
                    Private
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="filter-bar-sticky">
             {/* ... Giữ nguyên Search ... */}
             <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search in this list..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="anime-lists-container">
            {loading ? (
              <div className="loading-state">Loading anime details...</div>
            ) : Object.keys(groupedAnime).length > 0 ? (
              Object.keys(groupedAnime).map((user) => {
                const userAnimeList = filterAnime(groupedAnime[user]);
                if (userAnimeList.length === 0) return null;

                const displayList = userAnimeList; // Hiển thị hết hoặc logic phân trang tùy ý
                const isCurrentUser = user === currentUsername;
                
                return (
                  <div key={user} className="user-group-section">
                    <div className="user-group-header">
                      <div className="user-group-title">
                        <span className="material-symbols-outlined">person</span>
                        <h3>Added by {user}</h3>
                        <span className="count-badge">{userAnimeList.length}</span>
                        
                        {isCurrentUser && !deleteMode && (
                          <button 
                            className="btn-add-circle" 
                            title="Add Anime to this list"
                            onClick={() => setShowAddModal(true)} 
                          >
                            <span className="material-symbols-outlined">add</span>
                          </button>
                        )}
                      </div>

                      {/* --- [CẬP NHẬT 4] Các nút thao tác Delete cho Current User --- */}
                      {isCurrentUser && (
                        <div className="user-actions-controls">
                          {!deleteMode ? (
                            // 1. Nút kích hoạt Delete Mode
                            <button 
                              className="btn-icon-only text-danger"
                              onClick={toggleDeleteMode}
                              title="Delete items"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          ) : (
                            // 2. Nút Confirm và Cancel khi đang ở Delete Mode
                            <div className="delete-actions-group">
                              <span className="selection-count">
                                {selectedAnimeIds.length} selected
                              </span>
                              <button 
                                className="btn-icon-only text-secondary"
                                onClick={toggleDeleteMode}
                                title="Cancel"
                                disabled={isDeleting}
                              >
                                <span className="material-symbols-outlined">close</span>
                              </button>
                              <button 
                                className="btn-confirm-delete"
                                onClick={handleConfirmDelete}
                                title="Confirm Delete"
                                disabled={isDeleting || selectedAnimeIds.length === 0}
                              >
                                {isDeleting ? (
                                  <span className="material-symbols-outlined spin">sync</span>
                                ) : (
                                  <>
                                    <span className="material-symbols-outlined">check</span>
                                    <span>Confirm</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="anime-grid-row">
                      {displayList.map((anime) => {
                        // Xác định xem anime này có đang được chọn không
                        const isSelected = selectedAnimeIds.includes(anime._anilist_id || anime.id);
                        
                        return (
                          <div 
                            className={`grid-item-wrapper ${deleteMode ? 'delete-mode' : ''} ${isSelected ? 'selected' : ''}`} 
                            key={anime.id}
                            onClick={() => handleSelectAnime(anime._anilist_id || anime.id)}
                          >
                            <div className="grid-item">
                              <AnimeCard anime={anime} />
                            </div>
                            
                            {/* Overlay khi ở chế độ Delete */}
                            {deleteMode && (
                              <div className="delete-overlay">
                                <span className="material-symbols-outlined check-icon">
                                  {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                {/* ... Giữ nguyên empty state ... */}
                <p>This list is empty.</p>
                <button 
                  className="btn btn-primary" 
                  style={{marginTop: '16px'}}
                  onClick={() => setShowAddModal(true)}
                >
                  Add Anime Now
                </button>
              </div>
            )}
          </div>
        </main>

        <div className="sidebar-area">
          {/* ... Giữ nguyên Sidebar ... */}
          <div className="action-buttons sidebar-actions">
              {listInfo.is_owner ? (
                <>
                  <button className="btn btn-secondary" onClick={handleEditListClick}>
                     Edit List Details
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteList}>
                     Delete List
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-icon">
                   <span className="material-symbols-outlined">share</span>
                   Share List
                </button>
              )}
          </div>
          <Sidebar data={collaborators} />
        </div>
      </div>
      
      <AddAnimeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime} 
      />

      {/* ... Giữ nguyên Edit Modal ... */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            {/* ... code form edit ... */}
             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
               {/* Form nội dung cũ vẫn giữ nguyên */}
               <h2 className="modal-title">Edit List Details</h2>
               <form onSubmit={handleSaveEdit}>
                 {/* ... inputs ... */}
                 <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                    <button type="submit" className="btn-submit">Save Changes</button>
                 </div>
               </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnimeListPage;