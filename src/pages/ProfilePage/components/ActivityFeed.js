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
          // Đảm bảo activities luôn là mảng
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

  // Logic lọc Activity theo ngày
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

  // --- [LOGIC MỚI] Xử lý hiển thị cho từng loại hành động ---

  // 1. Lấy class màu sắc cho icon
  const getActionClass = (type) => {
      switch (type) {
          case 'followed_anime': 
          case 'create_list': // Tạo list cũng dùng màu xanh (add)
              return 'feed-icon-add';
          case 'updated_followed_anime': 
              return 'feed-icon-update';
          default: 
              return 'feed-icon-default';
      }
  };

  // 2. Lấy ký tự icon (+, ✎, hoặc icon list)
  const getActionIconChar = (type) => {
      if (type === 'create_list') return '☰'; // Ký tự menu/list
      if (type === 'followed_anime') return '+';
      if (type.includes('update')) return '✎';
      return '•';
  };

  // 3. Lấy nội dung mô tả hành động
  const getActionDescription = (item) => {
      switch (item.action_type) {
          case 'followed_anime':
              return 'added to list';
          case 'create_list':
              return 'created custom list';
          case 'updated_followed_anime':
              return 'updated progress';
          default:
              return 'performed action';
      }
  };

  // 4. Lấy tên đối tượng (Anime Title hoặc List Name)
  const getTargetName = (item) => {
      if (item.action_type === 'create_list') {
          return item.metadata?.list_name || "Unnamed List";
      }
      return item.metadata?.title || "Unknown Anime";
  };

  // 5. Xử lý click vào đối tượng (Điều hướng)
  const handleTargetClick = (item) => {
      if (item.action_type === 'create_list') {
          // Điều hướng đến trang chi tiết list (bạn tự điều chỉnh route cho phù hợp)
          navigate(`/collection/${item.target_id}`); 
      } else {
          // Điều hướng đến trang anime
          navigate(`/anime/${item.target_id}`);
      }
  };

  // ---------------------------------------------------------

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
            {/* Timeline Column */}
            <div className="feed-timeline">
               <div className={`feed-icon-circle ${getActionClass(item.action_type)}`}>
                   {getActionIconChar(item.action_type)}
               </div>
               {!isLast && <div className="feed-line"></div>}
            </div>

            {/* Content Column */}
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
                
                {/* [Tuỳ chọn] Nếu muốn hiện thêm chi tiết (ví dụ ảnh cover cho anime) có thể thêm ở đây */}
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