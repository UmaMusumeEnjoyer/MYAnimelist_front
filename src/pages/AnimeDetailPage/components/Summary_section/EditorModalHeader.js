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
    <div className="editor-modal-header">
      <button className="editor-modal-btn-close" onClick={onClose}>×</button>
      
      <div className="editor-modal-header-info">
        <img src={anime.cover_image} alt="thumb" className="editor-modal-thumb" />
        <span className="editor-modal-anime-title">{anime.name_romaji}</span>
      </div>
      
      <div className="editor-modal-header-actions">
        <button 
          className={`editor-modal-btn-icon ${isFavorite ? 'active' : ''}`} 
          onClick={toggleFavorite}
        >
          ♥
        </button>
        <button className="editor-modal-btn-save" onClick={onSave}>Save</button>
      </div>
    </div>
  );
};

export default EditorModalHeader;