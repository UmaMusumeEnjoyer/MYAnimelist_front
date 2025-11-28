import React, { useEffect, useState } from 'react';
import { getUserHeatmap } from '../../../services/api'; // Đảm bảo import đúng đường dẫn file api.js
import './ActivityHistory.css';

const ActivityHistory = () => {
  const [heatmapCounts, setHeatmapCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // 1. Hàm tạo danh sách 45 ngày gần nhất (tính từ hôm nay lùi về)
  // Kết quả trả về mảng các chuỗi "YYYY-MM-DD"
  const getLast45Days = () => {
    const dates = [];
    for (let i = 44; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      // Format thủ công để tránh lỗi lệch múi giờ so với toISOString()
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      const dateStr = `${year}-${month}-${day}`;
      dates.push(dateStr);
    }
    return dates;
  };

  const last45Days = getLast45Days();

  useEffect(() => {
    const fetchData = async () => {
      // 2. Lấy username từ localStorage
      // Giả sử bạn lưu username là một string với key 'username'
      // Nếu lưu trong object 'user', dùng: JSON.parse(localStorage.getItem('user'))?.username
      const username = localStorage.getItem('username'); 

      if (!username) {
        setLoading(false);
        return;
      }

      try {
        const res = await getUserHeatmap(username);
        
        // 3. Xử lý dữ liệu dựa trên cấu trúc JSON mới
        // API trả về: { year: 2025, counts: { "2025-01-01": 0, ... } }
        if (res.data && res.data.counts) {
          setHeatmapCounts(res.data.counts);
        }
      } catch (error) {
        console.error("Error fetching heatmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 4. Hàm xác định class màu sắc dựa trên số lượng
  const getLevelClass = (count) => {
    if (!count || count === 0) return ''; // Mặc định là màu xám (#2b384a)
    if (count <= 2) return 'act-lvl-1';
    if (count <= 5) return 'act-lvl-2';
    if (count <= 9) return 'act-lvl-3';
    return 'act-lvl-4';
  };

  if (loading) return <div className="sidebar-section"><div className="section-title">Loading...</div></div>;

  return (
    <div className="sidebar-section">
      <div className="section-title">Activity History (Last 45 Days)</div>
      <div className="activity-grid">
        {last45Days.map((dateStr) => {
          // Tra cứu số lượng từ object counts gọi về
          const count = heatmapCounts[dateStr] || 0; 
          
          return (
            <div 
              key={dateStr} 
              className={`act-dot ${getLevelClass(count)}`} 
              title={`${dateStr}: ${count} activities`} // Hover để xem ngày và số lượng
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActivityHistory;