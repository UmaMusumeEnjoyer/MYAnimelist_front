import React from 'react';
import './LikersModal.css'; // Chúng ta sẽ tạo file css này ở bước sau

const LikersModal = ({ isOpen, onClose, likersData, totalShowing, totalLikes }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content likers-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Liked by</h3>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="modal-body">
          {likersData.length === 0 ? (
            <p className="empty-text">No likes yet.</p>
          ) : (
            <ul className="likers-list">
              {likersData.map((user) => (
                <li key={user.id} className="liker-item">
                  <span className="material-symbols-outlined user-icon">person</span>
                  <span className="liker-username">{user.username}</span>
                  {user.email_verified && (
                    <span className="material-symbols-outlined verified-icon" title="Verified">verified</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          
          <div className="modal-footer-info">
            Showing {likersData.length} of {totalLikes} likes
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikersModal;