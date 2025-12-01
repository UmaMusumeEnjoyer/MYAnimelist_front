// src/pages/AnimeListPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AnimeCard from '../../components/AnimeCard';
import Sidebar from './components/Sidebar';
import { collaborators } from '../../data/mockDataSearchPage';
// [1] Import các hàm API cần thiết
import { getCustomListItems, getAnimeById } from '../../services/api'; 
import './AnimeListPage.css';

const AnimeListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const currentUsername = localStorage.getItem("username");
  // State lưu thông tin cơ bản của List
  const [listInfo, setListInfo] = useState(location.state?.listData || {
    list_name: "Loading...",
    description: "",
    is_owner: false
  });

  // State lưu danh sách anime đã được nhóm theo User
  // Cấu trúc: { "username1": [animeA, animeB], "username2": [animeC] }
  const [groupedAnime, setGroupedAnime] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // [2] Logic chính: Fetch List Items -> Fetch Anime Details -> Group by User
  useEffect(() => {
    if (id) {
      setLoading(true);

      // Bước 1: Lấy danh sách các items trong Custom List
      getCustomListItems(id)
        .then(async (res) => {
          const data = res.data; // Dữ liệu trả về từ API (như mẫu bạn cung cấp)
          
          // Cập nhật lại thông tin list chính xác từ server (đề phòng dữ liệu cũ từ state)
          setListInfo({
            list_name: data.list_name,
            description: data.description || "",
            is_private: data.is_private,
            // Nếu API trả về owner info thì update, tạm thời giữ nguyên
            ...location.state?.listData 
          });

          const items = data.anime_items || [];

          // Bước 2: Với mỗi item, gọi API getAnimeById để lấy thông tin chi tiết
          // Sử dụng Promise.all để gọi song song giúp tải nhanh hơn
          const detailedPromises = items.map((item) => 
            getAnimeById(item.anilist_id)
              .then((animeRes) => {
                // Merge thông tin phim + thông tin người add (added_by)
                return {
                  
                  
                  ...animeRes.data, // Thông tin chi tiết phim (Title, Cover...)
                  _added_by: item.added_by, // Lưu lại người thêm để phân loại
                  _added_date: item.added_date,
                  _note: item.note
                };
              })
              .catch((err) => {
                console.error(`Failed to load anime ${item.anilist_id}`, err);
                return null; // Trả về null nếu lỗi để lọc bỏ sau
              })
          );

          const detailedAnimeList = await Promise.all(detailedPromises);

          // Bước 3: Phân loại anime theo `added_by`
          const groups = {};
          detailedAnimeList.forEach((anime) => {
            if (anime) {
              const user = anime._added_by || "Unknown";
              if (!groups[user]) {
                groups[user] = [];
              }
              groups[user].push(anime);
            }
          });

          setGroupedAnime(groups);
        })
        .catch((err) => {
          console.error("Error fetching list data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Hàm lọc (Search) áp dụng cho từng nhóm
  const filterAnime = (list) => {
    if (!searchTerm) return list;
    return list.filter(anime => {
      const title = anime.name_romaji || anime.title?.english || "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  return (
    <div className="page-container">
      <div className="main-layout">
        
        <main className="content-area">
          <div className="page-header">
            <div className="header-text">
              <h1 className="page-title">{listInfo.list_name}</h1>
              <p className="page-description">{listInfo.description}</p>
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

          {/* [3] Render danh sách theo từng User */}
          <div className="anime-lists-container">
            {loading ? (
              <div className="loading-state">Loading anime details...</div>
            ) : Object.keys(groupedAnime).length > 0 ? (
              Object.keys(groupedAnime).map((user) => {
                // Lọc phim theo từ khóa search trước khi hiển thị
                const userAnimeList = filterAnime(groupedAnime[user]);
                
                // Nếu search không ra kết quả nào trong nhóm này thì ẩn luôn nhóm
                if (userAnimeList.length === 0) return null;

                // Chỉ lấy 5 phim đầu tiên để hiển thị
                const displayList = userAnimeList.slice(0, 5);
                const hasMore = userAnimeList.length > 5;
                const isCurrentUser = user === currentUsername;
                return (
                  <div key={user} className="user-group-section">
                    {/* Header của nhóm user */}
                    <div className="user-group-header">
                      <div className="user-group-title">
                        <span className="material-symbols-outlined">person</span>
                        <h3>Added by {user}</h3>
                        <span className="count-badge">{userAnimeList.length}</span>
                        {isCurrentUser && (
                          <button 
                            className="btn-add-circle" 
                            title="Add Anime to this list"
                            onClick={() => console.log("Open Add Modal")} // Chưa có logic, chỉ log
                          >
                            <span className="material-symbols-outlined">add</span>
                          </button>
                        )}
                      </div>
                      
                      {/* Nút See All (chưa có logic, chỉ hiển thị nếu > 5) */}
                      {hasMore && (
                        <button className="see-all-btn">
                          See All ({userAnimeList.length - 5} more)
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      )}
                    </div>

                    {/* Grid hiển thị 5 phim */}
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
              <div className="empty-state">This list is empty.</div>
            )}
          </div>

        </main>

        <div className="sidebar-area">
          <div className="action-buttons sidebar-actions">
              <button className="btn btn-primary">Share</button>
              {listInfo.is_owner && (
                <button className="btn btn-secondary btn-icon">
                   <span className="material-symbols-outlined">edit</span>
                   Edit List
                </button>
              )}
          </div>
          <Sidebar data={collaborators} />
        </div>

      </div>
    </div>
  );
};

export default AnimeListPage;