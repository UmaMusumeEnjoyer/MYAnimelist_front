// src/pages/AnimeListPage.js
import React, { useState } from 'react'; // [1] Import useState
import AnimeCard from '../../components/AnimeCard';
import Sidebar from './components/Sidebar';
import { animeList, collaborators } from '../../data/mockDataSearchPage';
import './AnimeListPage.css';

const AnimeListPage = () => {
  // [2] Tạo state để lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // [3] Logic lọc danh sách Anime
  // Giả sử trong object anime có thuộc tính 'title'. 
  // Nếu trong data của bạn tên thuộc tính khác (ví dụ: 'name', 'title_english'), hãy đổi 'anime.title' thành tên tương ứng.
  const filteredAnimeList = animeList.filter((anime) => {
    if (!searchTerm) return true; // Nếu không nhập gì thì lấy hết
    const title = anime.title_romaji || ""; // Lấy title, phòng trường hợp null
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page-container">
      <div className="main-layout">
        
        {/* LEFT COLUMN: Main Content */}
        <main className="content-area">
          
          {/* Page Header */}
          <div className="page-header">
            <div className="header-text">
              <h1 className="page-title">Our Top Shonen Series</h1>
              <p className="page-description">A collaborative list of the best shonen anime to watch.</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar-sticky">
            <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by title, status, or genre..."
                
                // [4] Binding giá trị và sự kiện
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-tabs">
              <button className="tab active">All</button>
              <button className="tab">Watching</button>
              <button className="tab">Completed</button>
              <button className="tab">Plan to Watch</button>
              <button className="tab">Dropped</button>
            </div>
          </div>

          {/* Anime Grid */}
          <div className="anime-grid">
            {/* [5] Render danh sách ĐÃ ĐƯỢC LỌC */}
            {filteredAnimeList.length > 0 ? (
              filteredAnimeList.map(anime => (
                <div className="grid-item" key={anime.id}>
                  <AnimeCard anime={anime} />
                </div>
              ))
            ) : (
              // Hiển thị thông báo nếu không tìm thấy kết quả
              <div style={{ color: '#94a3b8', gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                No anime found matching "{searchTerm}"
              </div>
            )}
          </div>

        </main>

        {/* RIGHT COLUMN: Sidebar + Buttons */}
        <div className="sidebar-area">
          <div className="action-buttons sidebar-actions">
              <button className="btn btn-primary">Share</button>
              <button className="btn btn-secondary">Add Anime</button>
              <button className="btn btn-secondary btn-icon">
                 <span className="material-symbols-outlined">palette</span>
                 Customize
              </button>
          </div>

          <Sidebar data={collaborators} />
        </div>

      </div>
    </div>
  );
};

export default AnimeListPage;