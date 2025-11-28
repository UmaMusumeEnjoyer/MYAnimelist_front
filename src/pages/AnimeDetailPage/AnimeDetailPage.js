// src/pages/AnimeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById } from '../../services/api';
import SummarySection from './components/Summary_section/SummarySection';
import InfoSidebar from './components/InfoSidebar'; // Component mới cho cột trái
import MainContentArea from './components/MainContentArea'; // Component mới cho cột phải
import './AnimeDetailPage.css';

const AnimeDetailPage = () => {
  // ... (phần code useState, useEffect giữ nguyên) ...
  const { animeId } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const response = await getAnimeById(animeId);
        setAnime(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết anime:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnime();
  }, [animeId]);

  if (loading) return <div>Loading...</div>;
  if (!anime) return <div>Không tìm thấy dữ liệu anime.</div>;
  

  const hasBanner = !!anime.banner_image;
  return (
    <>
      
      <div className="anime-detail-page">
        {/* CHỈ RENDER BANNER KHI CÓ DỮ LIỆU */}
        {hasBanner && (
          <div 
            className="banner-image" 
            style={{ backgroundImage: `url(${anime.banner_image})` }}
          ></div>
        )}
         <div className="main-content-container">
        <div className="content-wrapper">
          {/* Truyền prop hasBanner xuống SummarySection */}
          <SummarySection anime={anime} hasBanner={hasBanner} />
          
          <div className="detail-body-grid">
            <InfoSidebar anime={anime} />
            <MainContentArea anime={anime} />
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AnimeDetailPage;