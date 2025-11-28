// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import AnimeSection from './components/AnimeSection'; // Đảm bảo đường dẫn import đúng
import { getUserAnimeList } from '../../services/api';

const HomePage = () => {
  const [inProgressList, setInProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Lấy username từ localStorage (giả sử key là 'username')
        // Bạn cần đảm bảo lúc login đã lưu item này: localStorage.setItem('username', 'tên_user');
        const username = localStorage.getItem('username');

        if (username) {
          const response = await getUserAnimeList(username);
          // API trả về object có chứa mảng "watching", ta chỉ lấy mảng này
          if (response.data && response.data.watching) {
            setInProgressList(response.data.watching);
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
    return <div style={{ padding: '20px', color: '#fff' }}>Đang tải danh sách theo dõi...</div>;
  }

  return (
    <div>
      <div className="main-content-container">
        <main style={{ padding: '0 50px' }}>
          {/* Chỉ hiển thị mục Anime in Progress với danh sách Watching */}
          <AnimeSection title="Anime in Progress" animeList={inProgressList} />
        </main>
      </div>
    </div>
  );
};

export default HomePage;