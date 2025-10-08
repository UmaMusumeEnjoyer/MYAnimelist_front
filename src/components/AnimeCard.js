// src/components/AnimeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  let airingInfo = null;
  let progressPercent = 0;

  // Xử lý thông tin và tính toán tiến trình
  if (anime.next_airing_ep) {
    const { episode, timeUntilAiring } = anime.next_airing_ep;
    
    // Giả định thời gian giữa các tập là 1 tuần (604800 giây)
    const timeSinceAired = 604800 - timeUntilAiring;
    progressPercent = Math.max(0, Math.min(100, (timeSinceAired / 604800) * 100));

    // Format lại chuỗi thời gian đếm ngược
    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);

    let timeString = `${days}d ${hours}h ${minutes}m`;
    if (days === 0) {
      timeString = `${hours}h ${minutes}m`;
    }

    airingInfo = `Ep ${episode} - ${timeString}`;
  }

  return (
    <Link to={`/anime/${anime.id}`} className="anime-card-link">
      <div className="anime-card">
        <img 
          src={anime.cover_image} 
          alt={anime.name_romaji} 
          className="anime-poster" 
        />
        {airingInfo && (
          <div className="airing-info">
            <p className="episode-time">{airingInfo}</p>
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