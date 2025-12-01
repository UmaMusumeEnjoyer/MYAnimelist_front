import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom'; // [1] Import useNavigate
import ProfileBanner from './components/ProfileBanner';
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard';
// Thêm getUserCustomLists vào import
import { getUserAnimeList, getUserCustomLists } from '../../services/api'; 

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate(); // [2] Khởi tạo navigate
  // State cho Favorites
  const [favoriteList, setFavoriteList] = useState([]);
  const [loading, setLoading] = useState(false);

  // [MỚI] State cho Custom Anime Lists
  const [customLists, setCustomLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  const handleListClick = (list) => {
    // Điều hướng đến url /list/:id và truyền toàn bộ object list qua state
    navigate(`/list/${list.list_id}`, { state: { listData: list } });
  };

  // Logic lấy Favorites (giữ nguyên)
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

  // [MỚI] Logic lấy Custom Lists khi click tab "Anime List"
  useEffect(() => {
    if (activeTab === 'Anime List') {
      const username = localStorage.getItem('username');
      setListsLoading(true);
      
      // Gọi API getUserCustomLists
      getUserCustomLists(username)
        .then((res) => {
          // Cấu trúc response: { username: "...", lists: [...] }
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
    }
  }, [activeTab]);

  return (
    <div className="profile-page">
      <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Overview */}
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

      {/* [MỚI] Tab Anime List - Hiển thị danh sách Custom Lists */}
      {activeTab === 'Anime List' && (
        <div className="custom-lists-container">
          {listsLoading ? (
            <div className="loading-text">Loading lists...</div>
          ) : (
            <div className="custom-list-grid">
              {customLists.length > 0 ? (
                customLists.map((list) => (
                  <div 
                    key={list.list_id} 
                    className="custom-list-card"
                    // Sử dụng màu từ API làm màu nền hoặc màu viền
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
                <div className="empty-text">No custom lists found.</div>
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
    </div>
  );
};

export default ProfilePage;