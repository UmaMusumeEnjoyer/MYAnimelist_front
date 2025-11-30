import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import ProfileBanner from './components/ProfileBanner';
import ActivityHistory from './components/ActivityHistory';
import ActivityFeed from './components/ActivityFeed';
import AnimeCard from '../../components/AnimeCard';
import { getUserAnimeList } from '../../services/api'; //

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [favoriteList, setFavoriteList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // --- LOGIC MỚI: Xử lý dữ liệu từ API theo cấu trúc JSON mới ---
  useEffect(() => {
    if (activeTab === 'Favorites') {
      const username = localStorage.getItem('username');
      if (username) {
        setLoading(true);
        getUserAnimeList(username)
          .then((res) => {
            const data = res.data;

            // 1. Gộp tất cả các mảng trạng thái lại thành một mảng duy nhất
            // Cần kiểm tra kỹ vì có thể mảng rỗng hoặc undefined
            const allAnime = [
              ...(data.watching || []),
              ...(data.completed || []),
              ...(data.on_hold || []),
              ...(data.dropped || []),
              ...(data.plan_to_watch || [])
            ];

            // 2. Lọc lấy những anime có is_favorite === true
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

  return (
    <div className="profile-page">
      <ProfileBanner activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Tab Overview: Giữ nguyên giao diện cũ */}
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

      {/* Tab Favorites: Hiển thị Grid 6 cột */}
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