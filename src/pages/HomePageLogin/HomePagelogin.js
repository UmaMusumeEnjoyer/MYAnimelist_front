// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import AnimeSection from './components/AnimeSection'; 
import { getUserAnimeList } from '../../services/api';

const HomePage = () => {
  // Khởi tạo state cho tất cả các trạng thái
  const [inProgressList, setInProgressList] = useState([]);     // Watching
  const [completedList, setCompletedList] = useState([]);       // Completed
  const [pausedList, setPausedList] = useState([]);             // On Hold
  const [droppedList, setDroppedList] = useState([]);           // Dropped
  const [planningList, setPlanningList] = useState([]);        
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const username = localStorage.getItem('username');

        if (username) {
          const response = await getUserAnimeList(username);
          
          if (response.data) {
            // Mapping dữ liệu từ API vào state
            // Lưu ý: Kiểm tra kỹ key trả về từ API của bạn. 
            // Thường API (như AniList/MAL) trả về: watching, completed, on_hold (hoặc paused), dropped, planning (hoặc plan_to_watch)
            
            setInProgressList(response.data.watching || []);
            setCompletedList(response.data.completed || []);
            
            // Xử lý các trường hợp key có thể khác nhau tùy backend
            setPausedList(response.data.on_hold || response.data.paused || []);
            setDroppedList(response.data.dropped || []);
            setPlanningList(response.data.plan_to_watch || response.data.planning || []);
            
          }
        } else {
            console.warn("Không tìm thấy username trong localStorage");
        }
      } catch (error) {
        console.error("Lỗi khi fetch danh sách anime của user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px', color: '#fff' }}>
            <h2>Đang tải danh sách theo dõi...</h2>
        </div>
    );
  }

  return (
    <div>
      <div className="main-content-container">
        <main style={{ padding: '0 50px', maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* 1. Watching (Quan trọng nhất - để đầu tiên) */}
          <AnimeSection title="Anime in Progress" animeList={inProgressList} />
          
          {/* 2. Plan to Watch (Thường người dùng muốn xem cái này tiếp theo) */}
          <AnimeSection title="Plan to Watch" animeList={planningList} />

          {/* 3. Completed */}
          <AnimeSection title="Completed" animeList={completedList} />

          {/* 4. On Hold */}
          <AnimeSection title="On Hold" animeList={pausedList} />

          {/* 5. Dropped */}
          <AnimeSection title="Dropped" animeList={droppedList} />

        </main>
      </div>
    </div>
  );
};

export default HomePage;