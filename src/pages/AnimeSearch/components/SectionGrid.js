import React from 'react';
import AnimeCard from '../../../components/AnimeCard'; // Đảm bảo đường dẫn đúng
import './SectionGrid.css'; // Giữ nguyên CSS

const SectionGrid = ({ title, data, onViewAll }) => {
  return (
    <div className="container anime-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {/* [MỚI] Thêm sự kiện onClick cho View All */}
        <a 
          href="#!" 
          className="view-all-btn" 
          onClick={(e) => {
            e.preventDefault(); // Ngăn chặn reload trang
            if (onViewAll) onViewAll();
          }}
        >
          View All
        </a>
      </div>
      <div className="anime-grid">
        {data.map((anime) => (
          <div key={anime.id} className="grid-item">
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;