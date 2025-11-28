import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getUserActivity } from '../../../services/api';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username'); 
        if (username) {
          const res = await getUserActivity(username);
          setActivities(res.data.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };

  // Hàm trả về nội dung text hiển thị
  const getActionText = (actionType) => {
    switch (actionType) {
      case 'followed_anime': return 'Added to list';
      case 'updated_followed_anime': return 'Updated progress';
      default: return 'Interacted with';
    }
  };

  // [MỚI] Hàm trả về tên class CSS màu sắc dựa trên actionType
  const getActionClass = (actionType) => {
    switch (actionType) {
      case 'followed_anime': 
        return 'type-add'; // Class màu xanh lá
      case 'updated_followed_anime': 
        return 'type-update'; // Class màu xanh dương
      default: 
        return 'type-default'; // Class màu mặc định
    }
  };

  const formatTimeAgo = (seconds) => {
    if (!seconds) return '';
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const handleItemClick = (targetId) => {
    navigate(`/anime/${targetId}`);
  };

  if (loading) return <div className="feed-loading">Loading activity...</div>;
  if (activities.length === 0) return <div className="feed-empty">No recent activity</div>;

  return (
    <div className="feed-container">
      {activities.slice(0, visibleCount).map(item => (
        <div 
          key={item.id} 
          className="feed-item clickable" 
          onClick={() => handleItemClick(item.target_id)}
        >
          <div className="feed-content">
            <div className="feed-text">
              User has 
              {/* Thêm class động vào span */}
              <span className={`highlight ${getActionClass(item.action_type)}`}>
                 {` ${getActionText(item.action_type)} `}
              </span> 
              an anime
            </div>
            <div className="feed-meta">
              {formatTimeAgo(item.ago_seconds)}
            </div>
          </div>
        </div>
      ))}

      {visibleCount < activities.length && (
        <div className="load-more-btn" onClick={handleLoadMore}>
          Load More
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;