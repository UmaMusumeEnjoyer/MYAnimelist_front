import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import ProfileBanner from './components/ProfileBanner';
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard';

// [1] Thêm createCustomList vào import
import { getUserAnimeList, getUserCustomLists, createCustomList } from '../../services/api'; 

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();
  
  // State cho Favorites
  const [favoriteList, setFavoriteList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Custom Anime Lists
  const [customLists, setCustomLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);

  // [MỚI] State cho Modal tạo List
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListData, setNewListData] = useState({
    list_name: '',
    description: '',
    is_private: false,
    color: '#3db4f2' // Màu mặc định
  });
  const [creating, setCreating] = useState(false);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleListClick = (list) => {
    navigate(`/list/${list.list_id}`, { state: { listData: list } });
  };

  // Tách logic fetch list ra hàm riêng để tái sử dụng sau khi tạo mới
  const fetchCustomLists = () => {
    const username = localStorage.getItem('username');
    if (!username) return;

    setListsLoading(true);
    getUserCustomLists(username)
      .then((res) => {
        if (res.data && res.data.lists) {
          setCustomLists(res.data.lists);
        } else {
          setCustomLists([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch custom lists:", err);
        setCustomLists([]);
      })
      .finally(() => {
        setListsLoading(false);
      });
  };

  // Logic lấy Favorites
  useEffect(() => {
    if (activeTab === 'Favorites') {
      const username = localStorage.getItem('username');
      if (username) {
        setLoading(true);
        getUserAnimeList(username)
          .then((res) => {
            const data = res.data;
            const allAnime = [
              ...(data.watching || []),
              ...(data.completed || []),
              ...(data.on_hold || []),
              ...(data.dropped || []),
              ...(data.plan_to_watch || [])
            ];
            const filteredFavorites = allAnime.filter(anime => anime.is_favorite === true);
            setFavoriteList(filteredFavorites);
          })
          .catch((err) => {
            console.error("Failed to fetch anime list:", err);
            setFavoriteList([]);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [activeTab]);

  // Logic lấy Custom Lists
  useEffect(() => {
    if (activeTab === 'Anime List') {
      fetchCustomLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // [MỚI] Xử lý form tạo list
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewListData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // Gọi API createCustomList
      await createCustomList(newListData);
      
      // Thành công: Đóng modal, reset form, load lại danh sách
      setShowCreateModal(false);
      setNewListData({
        list_name: '',
        description: '',
        is_private: false,
        color: '#3db4f2'
      });
      fetchCustomLists(); // Load lại list để thấy list mới
    } catch (error) {
      console.error("Failed to create list:", error);
      alert("Error creating list. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="profile-page">
      <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div className="profile-content-container">
          <div className="left-column">
            <ActivityHistory />
          </div>
          <div className="right-column">
            <div className="activity-section">
              <div className="activity-filter">
                <span>Activity</span>
              </div>
              <ActivityFeed />
            </div>
          </div>
        </div>
      )}

      {/* Tab Anime List */}
      {activeTab === 'Anime List' && (
        <div className="custom-lists-container">
          
          {/* [MỚI] Header chứa nút Create */}
          <div className="list-section-header">
            <h2 className="section-heading">My Custom Lists</h2>
            <button 
              className="btn-create-list" 
              onClick={() => setShowCreateModal(true)}
            >
              + Create New List
            </button>
          </div>

          {listsLoading ? (
            <div className="loading-text">Loading lists...</div>
          ) : (
            <div className="custom-list-grid">
              {customLists.length > 0 ? (
                customLists.map((list) => (
                  <div 
                    key={list.list_id} 
                    className="custom-list-card"
                    style={{ '--card-color': list.color || '#3db4f2' }}
                    onClick={() => handleListClick(list)}
                  >
                    <div className="list-card-content">
                      <h3 className="list-name">{list.list_name}</h3>
                      <p className="list-desc">{list.description || "No description provided."}</p>
                      
                      <div className="list-meta">
                        {list.is_private && <span className="badge private">Private</span>}
                        <span className="list-date">
                          Created: {new Date(list.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-text">No custom lists found. Create one to get started!</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Favorites */}
      {activeTab === 'Favorites' && (
        <div className="favorites-container">
          {loading ? (
            <div className="loading-text">Loading favorites...</div>
          ) : (
            <div className="anime-grid-6">
              {favoriteList.length > 0 ? (
                favoriteList.map((anime) => (
                  <div key={anime.id || anime.anilist_id} className="grid-item">
                    <AnimeCard anime={anime} />
                  </div>
                ))
              ) : (
                <div className="empty-text">No favorites found.</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* [MỚI] Modal Create List */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            <form onSubmit={handleSubmitCreate} className="create-list-form">
              <div className="form-group">
                <label>List Name</label>
                <input 
                  type="text" 
                  name="list_name"
                  value={newListData.list_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Gai ban nhac"
                  required 
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="description"
                  value={newListData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Tại sao gái ban nhạc?"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group color-picker-group">
                  <label>Color Theme</label>
                  <div className="color-input-wrapper">
                    <input 
                      type="color" 
                      name="color"
                      value={newListData.color}
                      onChange={handleInputChange}
                    />
                    <span className="color-value">{newListData.color}</span>
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="is_private"
                      checked={newListData.is_private}
                      onChange={handleInputChange}
                    />
                    Private List
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;