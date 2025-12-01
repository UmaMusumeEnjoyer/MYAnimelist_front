// src/pages/AnimeListPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AnimeCard from '../../components/AnimeCard';
import Sidebar from './components/Sidebar';
import AddAnimeModal from './components/AddAnimeModal'; 

import { collaborators } from '../../data/mockDataSearchPage';
// [IMPORT API] Thêm addAnimeToCustomList
import { getCustomListItems, getAnimeById, addAnimeToCustomList } from '../../services/api'; 
import './AnimeListPage.css';

const AnimeListPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const currentUsername = localStorage.getItem("username");
  
  const [listInfo, setListInfo] = useState(location.state?.listData || {
    list_name: "Loading...",
    description: "",
    is_owner: false
  });

  const [groupedAnime, setGroupedAnime] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // [HÀM MỚI] Tách logic fetch data ra để tái sử dụng
  const fetchListDetails = useCallback(() => {
    if (!id) return;
    // Lưu ý: Chỉ set loading true lần đầu hoặc khi cần thiết, 
    // ở đây ta có thể giữ loading true nếu muốn reload toàn trang
    // hoặc xử lý tinh tế hơn.
    
    getCustomListItems(id)
      .then(async (res) => {
        const data = res.data;
        setListInfo(prev => ({
          list_name: data.list_name,
          description: data.description || "",
          is_private: data.is_private,
          // Merge state cũ nếu có (để giữ is_owner nếu API chưa trả về chuẩn)
          ...prev, 
          ...location.state?.listData 
        }));

        const items = data.anime_items || [];
        // Lấy chi tiết từng anime
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

        // Group theo user
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
  }, [id, location.state]);

  // Gọi fetch lần đầu
  useEffect(() => {
    setLoading(true);
    fetchListDetails();
  }, [fetchListDetails]);

  // [LOGIC MỚI] Xử lý thêm Anime
  const handleAddAnime = async (anime) => {
    try {
      // Body theo yêu cầu
      const payload = {
        anilist_id: anime.anilist_id || anime.media?.id || anime.id,
        note: ""
      };

      // Gọi API thêm vào list hiện tại (id lấy từ useParams)
      await addAnimeToCustomList(id, payload);

      // Sau khi thêm thành công, gọi lại API lấy danh sách để cập nhật giao diện
      fetchListDetails();

      console.log(`Successfully added: ${anime.title_romaji}`);
    } catch (error) {
      console.error("Failed to add anime:", error);
      // Ném lỗi ra để Modal bắt được và xử lý giao diện (tắt loading button)
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
                        
                        {/* Nút Add chỉ hiện cho chính chủ user đó */}
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
                          {/* Truyền thêm info để biết ai add */}
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
                {/* Nếu chưa có gì, nút này cho phép add item đầu tiên */}
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

      {/* MODAL */}
      <AddAnimeModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime} // Truyền hàm xử lý xuống
      />
    </div>
  );
};

export default AnimeListPage;