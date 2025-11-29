// src/pages/AnimeSearch/AnimeSearchPage.js
import React, { useState, useEffect } from 'react'; // [UPDATE] Thêm hooks
import AnimeCard from '../../components/AnimeCard';
import './AnimeSearchPage.css';

// [UPDATE] Import heroList thay vì heroData
import { 
  heroList,  // <-- Đổi từ heroData thành heroList (dạng mảng)
  trendingAnime, 
  popularSeason, 
  upcomingNext, 
  allTimePopular 
} from '../../data/animeSearchData';

// --- SUB-COMPONENTS ---

// [UPDATE] HeroSection: Chuyển thành Slider
const HeroSection = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides ? slides.length : 0;

  // Tự động chuyển slide sau 5 giây
  useEffect(() => {
    if (length === 0) return;
    const timer = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, length]);


  const moveDot = (index) => {
    setCurrent(index);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <div className="hero-slider">


      {/* Render danh sách các slide */}
      {slides.map((slide, index) => (
        <div
          className={index === current ? 'slide active' : 'slide'}
          key={slide.id}
        >
          {index === current && (
            <>
              <div className="hero-background">
                <img src={slide.bannerUrl} alt={slide.title} />
                <div className="hero-overlay"></div>
              </div>
              
              <div className="hero-content container">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-actions">
                  <button className="btn btn-primary"><i className="fas fa-play"></i> Xem ngay</button>
                  <button className="btn btn-secondary"><i className="fas fa-plus"></i> Thêm vào danh sách</button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Dấu chấm tròn điều hướng */}
      <div className="slider-dots">
        {slides.map((item, index) => (
          <div 
            key={index}
            onClick={() => moveDot(index)}
            className={current === index ? "dot active" : "dot"}
          ></div>
        ))}
      </div>
    </div>
  );
};

const FilterBar = () => {
  return (
    <div className="filter-bar container">
      <div className="filter-group search-input-group">
        <label>Search</label>
        <div className="search-box">
            <i className="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search anime..." />
        </div>
      </div>
      <div className="filter-group">
        <label>Genres</label>
        <select><option>Any</option><option>Action</option><option>Adventure</option></select>
      </div>
      <div className="filter-group">
        <label>Year</label>
        <select><option>Any</option><option>2024</option><option>2023</option></select>
      </div>
      <div className="filter-group">
        <label>Season</label>
        <select><option>Any</option><option>Winter</option><option>Summer</option></select>
      </div>
      <div className="filter-group">
        <label>Format</label>
        <select><option>Any</option><option>TV Show</option><option>Movie</option></select>
      </div>
      <div className="filter-toggle">
         <i className="fas fa-th-large"></i>
      </div>
    </div>
  );
};

const SectionGrid = ({ title, data, linkText = "View All" }) => {
  return (
    <div className="anime-section container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href="#" className="view-all">{linkText}</a>
      </div>
      <div className="anime-grid">
        {data && data.map((anime) => (
          <div key={anime.id} className="grid-item">
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const AnimeSearchPage = () => {
  return (
    <div className="anime-search-page">
      {/* [UPDATE] Truyền heroList vào prop slides */}
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