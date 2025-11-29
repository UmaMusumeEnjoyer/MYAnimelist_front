// src/pages/AnimeSearch/AnimeSearchPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // [1] IMPORT LINK TẠI ĐÂY
import AnimeCard from '../../components/AnimeCard';
import './AnimeSearchPage.css';

import {
  heroList,
  trendingAnime,
  popularSeason,
  upcomingNext,
  allTimePopular
} from '../../data/animeSearchData';

// --- SUB-COMPONENTS ---

const HeroSection = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides ? slides.length : 0;

  useEffect(() => {
    if (length === 0) return;
    const timer = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 7000);
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
                
                {/* [2] CẬP NHẬT PHẦN NÀY: Dùng Link thay cho button */}
                <div className="hero-actions">
                  <Link 
                    to={`/anime/${slide.id}`} 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }} // Đảm bảo không bị gạch chân
                  >
                    <i className="fas fa-play"></i> See details
                  </Link>
                </div>

              </div>
            </>
          )}
        </div>
      ))}

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

// ... (Giữ nguyên phần FilterBar, SectionGrid và AnimeSearchPage bên dưới)
const FilterBar = () => {
    // ... code cũ giữ nguyên
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