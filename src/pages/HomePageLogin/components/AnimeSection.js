// src/components/AnimeSection.js
import React, { useState } from 'react';
import AnimeCard from '../../../components/AnimeCard';
import './AnimeSection.css';

const AnimeSection = ({ title, animeList }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Nếu không có list hoặc list rỗng thì không render section này
  if (!animeList || animeList.length === 0) {
    return null;
  }

  // Logic hiển thị: Nếu expanded thì lấy hết, nếu không thì lấy 6 phần tử đầu
  const displayedAnime = isExpanded ? animeList : animeList.slice(0, 6);
  const showButton = animeList.length > 6;

  return (
    <section className="anime-section">
      <div className="section-header">
        <h2 className="section-title">
          {title} <span className="count-badge">{animeList.length}</span>
        </h2>
        
        {showButton && (
          <button 
            className="view-all-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      <div className="anime-grid">
        {displayedAnime.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
};

export default AnimeSection;