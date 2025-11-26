import React from 'react';
import './MediaGrid.css';

const MediaGrid = () => {
  const images = Array.from({ length: 16 }).map((_, i) => i);
  return (
    <div className="sidebar-section" style={{background: 'transparent', padding: 0}}>
      <div className="section-title">Anime</div>
      <div className="media-grid-container">
        {images.map((idx) => (
          <div key={idx} className="media-item">
            <img src="https://via.placeholder.com/150x220/2b384a/ffffff?text=Anime" alt="Cover" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MediaGrid;