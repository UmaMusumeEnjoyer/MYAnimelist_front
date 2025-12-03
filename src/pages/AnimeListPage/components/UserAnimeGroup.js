// src/pages/AnimeListPage/components/UserAnimeGroup.js
import React from 'react';
import AnimeCard from '../../../components/AnimeCard';
import './UserAnimeGroup.css';

const UserAnimeGroup = ({ 
  user, 
  animeList, 
  isCurrentUser, 
  canEdit, // [UPDATE] Nhận thêm prop canEdit
  deleteMode, 
  selectedAnimeIds, 
  isDeleting, 
  onOpenAddModal, 
  onToggleDeleteMode, 
  onConfirmDelete, 
  onSelectAnime 
}) => {
  
  if (animeList.length === 0) return null;

  // [UPDATE] Logic quyền chỉnh sửa: Phải là chính chủ VÀ có quyền edit
  // Nếu là viewer (canEdit = false) nhưng có items (isCurrentUser = true) -> hasEditPermission = false
  const hasEditPermission = isCurrentUser && canEdit;

  return (
    <div className="user-group-section">
      <div className="user-group-header">
        <div className="user-group-title">
          <span className="material-symbols-outlined">person</span>
          <h3>Added by {user}</h3>
          <span className="count-badge">{animeList.length}</span>
          
          {/* [UPDATE] Sử dụng hasEditPermission thay vì isCurrentUser */}
          {hasEditPermission && !deleteMode && (
            <button 
              className="btn-add-circle" 
              title="Add Anime to this list"
              onClick={onOpenAddModal} 
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>

        {/* [UPDATE] Sử dụng hasEditPermission thay vì isCurrentUser */}
        {hasEditPermission && (
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
              // [UPDATE] Chỉ cho phép style xóa nếu có quyền
              className={`grid-item-wrapper ${deleteMode && hasEditPermission ? 'delete-mode' : ''} ${isSelected ? 'selected' : ''}`} 
              key={anime.id}
              // [UPDATE] Chỉ cho phép click chọn nếu có quyền
              onClick={() => deleteMode && hasEditPermission && onSelectAnime(anime._anilist_id || anime.id)}
            >
              <div className="grid-item">
                <AnimeCard anime={anime} />
              </div>
              
              {/* [UPDATE] Chỉ hiện overlay check nếu có quyền */}
              {deleteMode && hasEditPermission && (
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