// src/components/AnimeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  let displayInfo = null;
  let progressPercent = 0;

  // 1. [FIX] Logic lấy tên: Ưu tiên title_romaji, nếu không có thì lấy name_romaji
  const title = anime.title_romaji || anime.name_romaji || "Unknown Title";

  // 2. Xử lý ID
  const linkId = anime.anilist_id || anime.id;

  // 3. LOGIC HIỂN THỊ (Giữ nguyên logic của bạn)
  if (anime.episode_progress !== undefined) {
    const currentEp = anime.episode_progress;
    const totalEp = anime.episodes || '?';
    
    displayInfo = `Watched: ${currentEp} / ${totalEp}`;
    
    if (anime.episodes && anime.episodes > 0) {
        progressPercent = Math.min(100, (currentEp / anime.episodes) * 100);
    }
  } 
  else if (anime.next_airing_ep) {
    const { episode, timeUntilAiring } = anime.next_airing_ep;
    // ... (Giữ nguyên logic tính thời gian của bạn) ...
    const timeSinceAired = 604800 - timeUntilAiring;
    progressPercent = Math.max(0, Math.min(100, (timeSinceAired / 604800) * 100));

    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);

    let timeString = `${days}d ${hours}h ${minutes}m`;
    if (days === 0) {
      timeString = `${hours}h ${minutes}m`;
    }
    displayInfo = `Ep ${episode} - ${timeString}`;
  }

  return (
    <Link to={`/anime/${linkId}`} className="anime-card-link">
      <div className="anime-card" title={title}>
        <img 
          src={anime.cover_image} 
          alt={title} 
          className="anime-poster" 
        />
        
        {/* [FIX] Container chứa thông tin (Tên + Progress) */}
        <div className="anime-details">
            {/* [FIX] Thêm dòng này để hiển thị Tên Anime */}
            <h3 className="anime-title-text">{title}</h3>

            {/* Hiển thị thông tin progress nếu có */}
            {displayInfo && (
            <div className="airing-info">
                <p className="episode-time">{displayInfo}</p>
                <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progressPercent}%` }}
                ></div>
                </div>
            </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;