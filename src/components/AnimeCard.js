import React from 'react';
import { Link } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  let displayInfo = null;
  let progressPercent = 0;

  // 1. Logic lấy tên
  const title = anime.title_romaji || anime.name_romaji || "Unknown Title";

  // 2. Xử lý ID
  const linkId = anime.anilist_id || anime.id;

  // 3. LOGIC HIỂN THỊ
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
    // Tính toán thời gian
    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);

    let timeString = `${days}d ${hours}h ${minutes}m`;
    if (days === 0) {
      timeString = `${hours}h ${minutes}m`;
    }
    displayInfo = `Ep ${episode} - ${timeString}`;
    
    // Thanh thời gian chờ (đảo ngược logic visual một chút cho đẹp mắt nếu cần)
    const timeSinceAired = 604800 - timeUntilAiring;
    progressPercent = Math.max(0, Math.min(100, (timeSinceAired / 604800) * 100));
  }

  // Logic class: Thêm 'no-info' nếu không có displayInfo
  const detailsClass = displayInfo ? 'anime-details' : 'anime-details no-info';

  return (
    <Link to={`/anime/${linkId}`} className="anime-card-link">
      <div className="anime-card" title={title}>
        <img 
          src={anime.cover_image} 
          alt={title} 
          className="anime-poster" 
        />
        
        <div className={detailsClass}>
            <h3 className="anime-title-text">{title}</h3>

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