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
  updateCustomList  
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
    
    getCustomListItems(id)
      .then(async (res) => {
        const data = res.data;
        console.log("API Response from getCustomListItems:", data); // DEBUG LOG
        
        // Update list info - Đảm bảo description được lấy từ API
        setListInfo(prev => {
          const newInfo = {
            ...prev, 
            list_name: data.list_name || prev.list_name,
            description: data.description !== undefined ? data.description : prev.description,
            is_private: data.is_private !== undefined ? data.is_private : prev.is_private,
            color: data.color || prev.color 
          };
          console.log("Updated listInfo:", newInfo); // DEBUG LOG
          return newInfo;
        });

        const items = data.anime_items || [];
        const detailedPromises = items.map((item) => 
          getAnimeById(item.anilist_id)
            .then((animeRes) => ({
                ...animeRes.data,
                _added_by: item.added_by,
                _added_date: item.added_date,
                _note: item.note
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

  // --- HANDLERS ---
  const handleEditListClick = () => {
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      // 1. Gửi dữ liệu lên Server
      await updateCustomList(id, editFormData);

      // 2. [FIX] Cập nhật giao diện NGAY LẬP TỨC từ dữ liệu form
      // Không chờ fetch lại từ server để tránh độ trễ hoặc lỗi data null
      setListInfo(prev => ({
        ...prev,
        list_name: editFormData.list_name,
        description: editFormData.description, // Đảm bảo lấy description mới nhất
        is_private: editFormData.is_private,
        color: editFormData.color
      }));

      alert("List details updated successfully!");
      setShowEditModal(false);
      
      // XÓA dòng window.location.reload(); 
      // Có thể bỏ luôn fetchListDetails(); nếu muốn giữ UI ổn định
      
    } catch (error) {
      console.error("Failed to update list:", error);
      alert("An error occurred while updating the list.");
    }
  };

  const handleDeleteList = async () => {
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

  const handleAddAnime = async (anime) => {
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

  const filterAnime = (list) => {
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
            <div className="header-text">
              <h1 className="page-title">{listInfo.list_name}</h1>
              
              {/* [CẬP NHẬT] Hiển thị Description với pre-line để giữ xuống dòng */}
              {listInfo.description && (
                <p 
                  className="page-description" 
                  style={{ whiteSpace: 'pre-line', marginTop: '8px' }}
                >
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

                const displayList = userAnimeList.slice(0, 5);
                const hasMore = userAnimeList.length > 5;
                const isCurrentUser = user === currentUsername;
                
                return (
                  <div key={user} className="user-group-section">
                    <div className="user-group-header">
                      <div className="user-group-title">
                        <span className="material-symbols-outlined">person</span>
                        <h3>Added by {user}</h3>
                        <span className="count-badge">{userAnimeList.length}</span>
                        {isCurrentUser && (
                          <button 
                            className="btn-add-circle" 
                            title="Add Anime to this list"
                            onClick={() => setShowAddModal(true)} 
                          >
                            <span className="material-symbols-outlined">add</span>
                          </button>
                        )}
                      </div>
                      {hasMore && (
                        <button className="see-all-btn">
                          See All ({userAnimeList.length - 5} more)
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      )}
                    </div>
                    <div className="anime-grid-row">
                      {displayList.map((anime) => (
                        <div className="grid-item" key={anime.id}>
                          <AnimeCard anime={anime} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
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
          <div className="action-buttons sidebar-actions">
              {listInfo.is_owner ? (
                <>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleEditListClick}
                  >
                     Edit List Details
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={handleDeleteList}
                  >
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

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit List Details</h2>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>List Name</label>
                <input 
                  type="text" 
                  name="list_name"
                  value={editFormData.list_name}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Theme Color</label>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      name="color"
                      value={editFormData.color}
                      onChange={handleInputChange}
                    />
                    <span className="color-value">{editFormData.color}</span>
                  </div>
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="is_private"
                      checked={editFormData.is_private}
                      onChange={handleInputChange}
                    />
                    Private List
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeListPage;