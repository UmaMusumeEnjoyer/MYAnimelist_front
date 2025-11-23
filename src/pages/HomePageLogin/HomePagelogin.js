// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import AnimeSection from './components/AnimeSection';
import { getAnimeById } from '../../services/api';

const HomePage = () => {
  // ▼▼▼ NHẬP ID CHO KHU VỰC "AIRING" TẠI ĐÂY ▼▼▼
  const airingAnimeIds = [181182, 178701];

  // ▼▼▼ NHẬP ID CHO KHU VỰC "ANIME IN PROGRESS" TẠI ĐÂY ▼▼▼
  const inProgressAnimeIds = [195153, 173523, 183385];

  // Tạo 2 state riêng biệt cho mỗi danh sách
  const [airingList, setAiringList] = useState([]);
  const [inProgressList, setInProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm helper để lấy dữ liệu từ một danh sách ID
    const fetchAnimeList = async (ids) => {
      try {
        const promises = ids.map(id => getAnimeById(id));
        const responses = await Promise.all(promises);
        return responses.map(res => res.data);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách anime:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      // Gọi API cho cả 2 danh sách cùng lúc
      const [airingData, inProgressData] = await Promise.all([
        fetchAnimeList(airingAnimeIds),
        fetchAnimeList(inProgressAnimeIds)
      ]);
      
      setAiringList(airingData);
      setInProgressList(inProgressData);
      setLoading(false);
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div>
      
      <div className="main-content-container">
      <main style={{ padding: '0 50px' }}>
        {/* Render 2 khu vực riêng biệt */}
        <AnimeSection title="Airing" animeList={airingList} />
        <AnimeSection title="Anime in Progress" animeList={inProgressList} />
      </main>
    </div>
    </div>
  );
};

export default HomePage;