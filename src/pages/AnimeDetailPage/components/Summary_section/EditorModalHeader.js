// src/components/EditorModalHeader.js
import React from 'react';

const EditorModalHeader = ({ 
  anime, 
  onClose, 
  onSave, 
  isFavorite, 
  toggleFavorite 
}) => {
  return (
    <div className="modal-header">
      <button className="btn-close" onClick={onClose}>×</button>
      
      <div className="header-info">
        <img src={anime.cover_image} alt="thumb" className="modal-thumb" />
        <span className="modal-anime-title">{anime.name_romaji}</span>
      </div>
      
      <div className="header-actions">
        <button 
          className={`btn-icon ${isFavorite ? 'active' : ''}`} 
          onClick={toggleFavorite}
        >
          ♥
        </button>
        <button className="btn-save" onClick={onSave}>Save</button>
      </div>
    </div>
  );
};

export default EditorModalHeader;