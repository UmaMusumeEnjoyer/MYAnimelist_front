import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getUserActivity } from '../../../services/api'; 
import './ActivityFeed.css';

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

  const getFilteredActivities = () => {
    if (!filterDate) return activities;

    return activities.filter(item => {
      const actionDate = new Date(Date.now() - item.ago_seconds * 1000);
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

  // --- LOGIC HIỂN THỊ ---

  const getActionClass = (type) => {
      switch (type) {
          case 'followed_anime': 
          case 'create_list': 
              return 'feed-icon-add';
          case 'updated_followed_anime': 
              return 'feed-icon-update';
          default: 
              return 'feed-icon-default';
      }
  };

  const getActionIconChar = (type) => {
      if (type === 'create_list') return '☰'; 
      if (type === 'followed_anime') return '+';
      if (type.includes('update')) return '✎';
      return '•';
  };

  // [ĐÃ SỬA] Cập nhật text hiển thị
  const getActionDescription = (item) => {
      switch (item.action_type) {
          case 'followed_anime':
              return 'followed anime'; // Sửa thành "followed anime"
          case 'create_list':
              return 'created custom list';
          case 'updated_followed_anime':
              return 'updated progress';
          default:
              return 'performed action';
      }
  };

  const getTargetName = (item) => {
      if (item.action_type === 'create_list') {
          return item.metadata?.list_name || "Unnamed List";
      }
      return item.metadata?.title || "Unknown Anime";
  };

  // [ĐÃ SỬA] Cập nhật đường dẫn điều hướng
  const handleTargetClick = (item) => {
      if (item.action_type === 'create_list') {
          navigate(`/list/${item.target_id}`); // Sửa thành /list/{id}
      } else {
          navigate(`/anime/${item.target_id}`);
      }
  };

  // -----------------------

  if (loading) return <div className="feed-loading">Loading activity...</div>;
  
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
        const isLast = index === displayItems.length - 1;

        return (
          <div key={item.id} className="feed-row">
            <div className="feed-timeline">
               <div className={`feed-icon-circle ${getActionClass(item.action_type)}`}>
                   {getActionIconChar(item.action_type)}
               </div>
               {!isLast && <div className="feed-line"></div>}
            </div>

            <div className="feed-content-wrapper">
                <div className="feed-header">
                    <span className="feed-user">{username}</span>
                    
                    <span className="feed-action">
                        {getActionDescription(item)}
                    </span>
                    
                    <span className="feed-target clickable" onClick={() => handleTargetClick(item)}>
                        {getTargetName(item)}
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