// src/components/AnimeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  let displayInfo = null;
  let progressPercent = 0;

  // 1. Xử lý tên hiển thị (Ưu tiên title_romaji từ API mới, fallback về name_romaji)
  const title = anime.title_romaji || anime.name_romaji;

  // 2. Xử lý ID để link (API user list trả về 'anilist_id' để link tới chi tiết, 'id' là id trong DB)
  // Nếu không có anilist_id thì dùng id thường
  const linkId = anime.anilist_id || anime.id;

  // 3. LOGIC HIỂN THỊ
  
  // A. Trường hợp là User Anime List (Có episode_progress)
  if (anime.episode_progress !== undefined) {
    const currentEp = anime.episode_progress;
    const totalEp = anime.episodes || '?';
    
    displayInfo = `Watched: ${currentEp} / ${totalEp}`;
    
    // Tính phần trăm thanh progress bar
    if (anime.episodes && anime.episodes > 0) {
        progressPercent = Math.min(100, (currentEp / anime.episodes) * 100);
    }
  } 
  // B. Trường hợp là Airing Anime (Logic cũ - giữ lại để tương thích nếu cần dùng lại)
  else if (anime.next_airing_ep) {
    const { episode, timeUntilAiring } = anime.next_airing_ep;
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
        {/* Hiển thị thông tin nếu có (Airing time hoặc Watching progress) */}
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
    </Link>
  );
};

export default AnimeCard;