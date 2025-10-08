// src/components/AnimeCard.js
import React from 'react';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {

  const renderEpisodeInfo = () => {
    // Ưu tiên 1: Hiển thị thời gian đếm ngược nếu có
    if (anime.next_airing_ep) {
      const { episode, timeUntilAiring } = anime.next_airing_ep;
      
      // Chuyển đổi giây thành ngày, giờ, và phút
      const days = Math.floor(timeUntilAiring / 86400);
      const hours = Math.floor((timeUntilAiring % 86400) / 3600);
      const minutes = Math.floor(((timeUntilAiring % 86400) % 3600) / 60);

      return `Ep ${episode} - ${days}d ${hours}h ${minutes}m`;
    }

    // Ưu tiên 2: Hiển thị tổng số tập nếu anime đã kết thúc
    // Phần này có thể hữu ích cho khu vực "Anime in Progress" nếu anime đó đã chiếu xong
    if (anime.airing_status === 'FINISHED') {
      return `Finished - ${anime.airing_episodes} eps`;
    }
    
    // Mặc định không hiển thị gì
    return null;
  };

  return (
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
  );
};

export default AnimeCard;