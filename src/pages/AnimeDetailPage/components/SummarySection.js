import React from 'react';
import './SummarySection.css';

const SummarySection = ({ anime, hasBanner }) => {
  return (
    <div className={`summary-section ${!hasBanner ? 'no-banner' : ''}`}>
      <div className="summary-left">
        <img src={anime.cover_image} alt="Cover" className="summary-cover" />
        <button className="btn btn-watching">Watching ▼</button>
        <button className="btn btn-favorite">❤️</button>
      </div>
      <div className="summary-right">
        <h1 className="anime-title-main">{anime.name_romaji}</h1>
        <div 
          className="anime-description" 
          dangerouslySetInnerHTML={{ __html: anime.desc }}
        ></div>
      </div>
    </div>
  );
};

export default SummarySection;