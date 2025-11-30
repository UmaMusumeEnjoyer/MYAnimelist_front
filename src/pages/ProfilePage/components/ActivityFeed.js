import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getUserActivity } from '../../../services/api'; // Đảm bảo đường dẫn đúng
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

  const getActionText = (actionType) => {
    switch (actionType) {
      case 'followed_anime': return 'Added to list';
      case 'updated_followed_anime': return 'Updated progress';
      default: return 'Interacted with';
    }
  };

  const getActionClass = (actionType) => {
    switch (actionType) {
      case 'followed_anime': return 'type-add';
      case 'updated_followed_anime': return 'type-update';
      default: return 'type-default';
    }
  };

  const formatTimeAgo = (seconds) => {
    if (!seconds) return '';
    if (seconds < 60) return `${seconds}s ago`; // Rút gọn cho đỡ tốn diện tích
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleItemClick = (targetId) => {
    navigate(`/anime/${targetId}`);
  };

  if (loading) return <div className="feed-loading">Loading activity...</div>;
  if (activities.length === 0) return <div className="feed-empty">No recent activity</div>;
  const username = localStorage.getItem("username");
  return (
    <div className="feed-container">
      {activities.slice(0, visibleCount).map(item => {
        // =================================================================================
        // [TODO]: KẾT NỐI API - BẠN HÃY SỬA CÁC TRƯỜNG DƯỚI ĐÂY KHI CÓ DỮ LIỆU THẬT
        // =================================================================================
        // 1. Dữ liệu giả lập an toàn (nếu item.anime_name chưa có thì dùng "Unknown")
        const animeTitle = item.metadata?.title || "Unknown Anime";

        // 2. Ảnh Placeholder dạng Base64 (Tạo một hình chữ nhật màu xám #2b3847 ngay lập tức)
        const PLACEHOLDER_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2248%22%20height%3D%2264%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%2248%22%20height%3D%2264%22%20fill%3D%22%232b3847%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%20fill%3D%22%236b7c93%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%3E%3F%3C%2Ftext%3E%3C%2Fsvg%3E";

        // Nếu chưa có dữ liệu cover_image, dùng luôn placeholder để tránh load lỗi
        const animeImage = item.metadata?.cover_image || PLACEHOLDER_IMG;
        
        // =================================================================================

        return (
          <div 
            key={item.id} 
            className="feed-item clickable" 
            onClick={() => handleItemClick(item.target_id)}
          >
            {/* 1. Phần Thumbnail ảnh */}
            <div className="feed-image-wrapper">
              <img 
                src={animeImage} 
                alt={animeTitle} 
                className="feed-thumbnail"
                onError={(e) => {e.target.src = 'https://via.placeholder.com/48'}} // Fallback nếu ảnh lỗi
              />
            </div>

            {/* 2. Phần nội dung text */}
            <div className="feed-content">
              <div className="feed-main-info">
                <span className="feed-text-prefix">{username} has </span>
                
                {/* Hành động (Màu sắc) */}
                <span className={`highlight ${getActionClass(item.action_type)}`}>
                   {getActionText(item.action_type)}
                </span>
                
                {/* Tên phim (Tô đậm) */}
                <span className="feed-anime-name">
                  {animeTitle}
                </span>
              </div>
              
              {/* 3. Thời gian */}
              <div className="feed-meta">
                {formatTimeAgo(item.ago_seconds)}
              </div>
            </div>
          </div>
        );
      })}

      {visibleCount < activities.length && (
        <div className="load-more-btn" onClick={handleLoadMore}>
          Load More
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;