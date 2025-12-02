import React from 'react';
import AnimeCard from '../../../components/AnimeCard';
import './UserAnimeGroup.css';

const UserAnimeGroup = ({ 
  user, 
  animeList, 
  isCurrentUser, 
  deleteMode, 
  selectedAnimeIds, 
  isDeleting, 
  // Callbacks
  onOpenAddModal, 
  onToggleDeleteMode, 
  onConfirmDelete, 
  onSelectAnime 
}) => {
  
  if (animeList.length === 0) return null;

  return (
    <div className="user-group-section">
      <div className="user-group-header">
        <div className="user-group-title">
          <span className="material-symbols-outlined">person</span>
          <h3>Added by {user}</h3>
          <span className="count-badge">{animeList.length}</span>
          
          {isCurrentUser && !deleteMode && (
            <button 
              className="btn-add-circle" 
              title="Add Anime to this list"
              onClick={onOpenAddModal} 
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>

        {isCurrentUser && (
          <div className="user-actions-controls">
            {!deleteMode ? (
              <button 
                className="btn-icon-only text-danger"
                onClick={onToggleDeleteMode}
                title="Delete items"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            ) : (
              <div className="delete-actions-group">
                <span className="selection-count">
                  {selectedAnimeIds.length} selected
                </span>
                <button 
                  className="btn-icon-only text-secondary"
                  onClick={onToggleDeleteMode}
                  title="Cancel"
                  disabled={isDeleting}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <button 
                  className="btn-confirm-delete"
                  onClick={onConfirmDelete}
                  title="Confirm Delete"
                  disabled={isDeleting || selectedAnimeIds.length === 0}
                >
                  {isDeleting ? (
                    <span className="material-symbols-outlined spin">sync</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">check</span>
                      <span>Confirm</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="anime-grid-row">
        {animeList.map((anime) => {
          const isSelected = selectedAnimeIds.includes(anime._anilist_id || anime.id);
          
          return (
            <div 
              className={`grid-item-wrapper ${deleteMode ? 'delete-mode' : ''} ${isSelected ? 'selected' : ''}`} 
              key={anime.id}
              onClick={() => deleteMode && onSelectAnime(anime._anilist_id || anime.id)}
            >
              <div className="grid-item">
                <AnimeCard anime={anime} />
              </div>
              
              {deleteMode && (
                <div className="delete-overlay">
                  <span className="material-symbols-outlined check-icon">
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAnimeGroup;