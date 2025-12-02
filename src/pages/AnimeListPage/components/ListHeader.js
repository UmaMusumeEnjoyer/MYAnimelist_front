import React, { useState, useEffect } from 'react';
import { toggleLikeList, getListLikeStatus, getListLikers } from '../../../services/api'; 
import LikersModal from './LikersModal';
import './ListHeader.css';

const ListHeader = ({ listInfo, listId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  // States cho Likers Modal
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [likersList, setLikersList] = useState([]);
  const [showingCount, setShowingCount] = useState(0);

  useEffect(() => {
    if (!listId) return;
    const fetchLikeStatus = async () => {
      try {
        const res = await getListLikeStatus(listId);
        setIsLiked(res.data.is_liked);
        setLikeCount(res.data.like_count);
      } catch (error) {
        console.error("Failed to fetch like status", error);
      }
    };
    fetchLikeStatus();
  }, [listId]);

  const handleToggleLike = async () => {
    if (isLoadingLike || !listId) return;

    const prevIsLiked = isLiked;
    const prevCount = likeCount;
    
    setIsLiked(!prevIsLiked);
    setLikeCount(prevIsLiked ? prevCount - 1 : prevCount + 1);
    setIsLoadingLike(true);

    try {
      const res = await toggleLikeList(listId);
      setIsLiked(res.data.is_liked);
      setLikeCount(res.data.like_count);
    } catch (error) {
      setIsLiked(prevIsLiked);
      setLikeCount(prevCount);
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleViewLikers = async () => {
    if (!listInfo.is_owner) return; 

    try {
      const payload = { limit: 20 };
      const res = await getListLikers(listId, payload);
      
      setLikersList(res.data.likers || []);
      setShowingCount(res.data.showing || 0);
      setLikeCount(res.data.like_count); 
      
      setShowLikersModal(true);
    } catch (error) {
      console.error("Failed to fetch likers list", error);
    }
  };

  return (
    <div className="page-header">
      <div className="header-text">
        <h1 className="page-title">{listInfo.list_name}</h1>
        {listInfo.description && (
          <p className="page-description">{listInfo.description}</p>
        )}
        {listInfo.is_private && (
          <div className="private-badge-wrapper">
            <span className="count-badge private-badge">Private</span>
          </div>
        )}
      </div>

      <div className="header-actions">
        {/* NÚT 1: CHỈ ĐỂ LIKE */}
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`} 
          onClick={handleToggleLike}
          disabled={isLoadingLike}
          title={isLiked ? "Unlike" : "Like"}
        >
          <span className={`material-symbols-outlined heart-icon ${isLiked ? 'filled' : ''}`}>
            favorite
          </span>
        </button>

        {/* NÚT 2: HIỂN THỊ SỐ LƯỢNG & XEM DANH SÁCH (RIÊNG BIỆT) */}
        <button 
          className={`action-btn count-btn ${listInfo.is_owner ? 'clickable' : ''}`}
          onClick={listInfo.is_owner ? handleViewLikers : undefined}
          title={listInfo.is_owner ? "View who liked this list" : ""}
          disabled={!listInfo.is_owner && likeCount === 0} // Disable nếu không phải owner
        >
          <span className="count-number">{likeCount}</span>
          <span className="count-label">Likes</span>
        </button>
      </div>

      <LikersModal 
        isOpen={showLikersModal}
        onClose={() => setShowLikersModal(false)}
        likersData={likersList}
        totalShowing={showingCount}
        totalLikes={likeCount}
      />
    </div>
  );
};

export default ListHeader;