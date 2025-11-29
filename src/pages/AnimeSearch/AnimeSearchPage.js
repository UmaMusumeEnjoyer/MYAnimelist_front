import React from 'react';
import './AnimeSearchPage.css';

// Import Components
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import SectionGrid from './components/SectionGrid';

// Import Data
// Lưu ý: Đường dẫn này giả định thư mục data nằm ở src/data. 
// Bạn cần điều chỉnh ../../.. nếu cần thiết tùy vào cấu trúc thực tế.
import {
  heroList,
  trendingAnime,
  popularSeason,
  upcomingNext,
  allTimePopular
} from '../../data/animeSearchData';

const AnimeSearchPage = () => {
  return (
    <div className="anime-search-page">
      <HeroSection slides={heroList} />
      <FilterBar />
      <div className="page-content">
        <SectionGrid title="TRENDING NOW" data={trendingAnime} />
        <SectionGrid title="POPULAR THIS SEASON" data={popularSeason} />
        <SectionGrid title="UPCOMING NEXT SEASON" data={upcomingNext} />
        <SectionGrid title="ALL TIME POPULAR" data={allTimePopular} />
      </div>
    </div>
  );
};

export default AnimeSearchPage;