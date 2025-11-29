import React from 'react';
// Import AnimeCard từ thư mục components chung của dự án
// Lưu ý: Đường dẫn này phụ thuộc vào vị trí thực tế của AnimeCard so với file này
import AnimeCard from '../../../components/AnimeCard'; 
import './SectionGrid.css';

const SectionGrid = ({ title, data, linkText = "View All" }) => {
  return (
    <div className="anime-section container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href="#" className="view-all">{linkText}</a>
      </div>
      <div className="anime-grid">
        {data && data.map((anime) => (
          <div key={anime.id} className="grid-item">
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;