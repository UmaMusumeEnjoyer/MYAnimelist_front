// src/components/AnimeCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  // ... hàm renderEpisodeInfo giữ nguyên ...
  const renderEpisodeInfo = () => {
    if (anime.next_airing_ep) {
        const { episode, timeUntilAiring } = anime.next_airing_ep;
        const days = Math.floor(timeUntilAiring / 86400);
        const hours = Math.floor((timeUntilAiring % 86400) / 3600);
        const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);
        return `Ep ${episode} - ${days}d ${hours}h ${minutes}m`;
    }
    if (anime.airing_status === 'FINISHED') {
        return `Finished - ${anime.airing_episodes} eps`;
    }
    return null;
  };


  return (
    // Bọc toàn bộ card bằng Link
    <Link to={`/anime/${anime.id}`} className="anime-card-link">
      <div className="anime-card">
        <img 
          src={anime.cover_image} 
          alt={anime.name_romaji} 
          className="anime-poster" 
        />
        {renderEpisodeInfo() && (
          <div className="anime-overlay">
            <span className="episode-info">{renderEpisodeInfo()}</span>
          </div>
        )}
        <p className="anime-title">{anime.name_romaji}</p>
      </div>
    </Link>
  );
};

export default AnimeCard;