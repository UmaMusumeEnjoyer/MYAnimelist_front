import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getUserActivity } from '../../../services/api'; 
import './ActivityFeed.css';

// [MỚI] Nhận filterDate
const ActivityFeed = ({ filterDate }) => {
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

  // [MỚI] Logic lọc Activity
  const getFilteredActivities = () => {
    if (!filterDate) return activities;

    return activities.filter(item => {
      // Tính toán ngày của activity từ ago_seconds
      // ago_seconds là số giây trôi qua từ lúc activity đến hiện tại
      // => Thời gian activity = Hiện tại - ago_seconds
      const actionDate = new Date(Date.now() - item.ago_seconds * 1000);
      
      // Chuyển về chuỗi YYYY-MM-DD để so sánh
      const actionDateStr = actionDate.toISOString().split('T')[0];
      
      return actionDateStr === filterDate;
    });
  };

  const filteredItems = getFilteredActivities();
  const displayItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount(prev => prev + 10);
  
  const formatTimeAgo = (s) => {
      if (s < 60) return 'now';
      if (s < 3600) return `${Math.floor(s/60)}m ago`;
      if (s < 86400) return `${Math.floor(s/3600)}h ago`;
      return `${Math.floor(s/86400)}d ago`;
  };

  const getActionClass = (type) => {
      if (type === 'followed_anime') return 'feed-icon-add';
      if (type === 'updated_followed_anime') return 'feed-icon-update';
      return 'feed-icon-default';
  };

  if (loading) return <div className="feed-loading">Loading activity...</div>;
  
  // [MỚI] Hiển thị thông báo nếu không có activity nào trong ngày đã chọn
  if (filteredItems.length === 0) {
    return (
      <div className="feed-empty" style={{textAlign: 'left', paddingLeft: '10px', color: 'var(--text-secondary)'}}>
        {filterDate ? `No activity recorded on ${filterDate}.` : "No recent activity."}
      </div>
    );
  }

  const username = localStorage.getItem("username");

  return (
    <div className="feed-container">
      {displayItems.map((item, index) => {
        const animeTitle = item.metadata?.title || "Unknown Anime";
        const isLast = index === displayItems.length - 1;

        return (
          <div key={item.id} className="feed-row">
            {/* Timeline Column */}
            <div className="feed-timeline">
               <div className={`feed-icon-circle ${getActionClass(item.action_type)}`}>
                   {item.action_type === 'followed_anime' ? '+' : '✎'}
               </div>
               {!isLast && <div className="feed-line"></div>}
            </div>

            {/* Content Column */}
            <div className="feed-content-wrapper">
                <div className="feed-header">
                    <span className="feed-user">{username}</span>
                    <span className="feed-action">
                        {item.action_type === 'followed_anime' ? 'added to list' : 'updated progress'}
                    </span>
                    <span className="feed-target clickable" onClick={() => navigate(`/anime/${item.target_id}`)}>
                        {animeTitle}
                    </span>
                    <span className="feed-time">{formatTimeAgo(item.ago_seconds)}</span>
                </div>
            </div>
          </div>
        );
      })}

      {visibleCount < filteredItems.length && (
        <button className="btn-load-more" onClick={handleLoadMore}>
          Load more activity
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;