// src/pages/AnimeSearch/AnimeSearchPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
// ... (Giữ nguyên HeroSection)
const HeroSection = ({ slides }) => {
    // ... Code cũ của HeroSection giữ nguyên
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
                  
                  <div className="hero-actions">
                    <Link 
                      to={`/anime/${slide.id}`} 
                      className="btn btn-primary"
                      style={{ textDecoration: 'none' }}
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

// --- CẬP NHẬT FILTER BAR VỚI CÁC CLASS RIÊNG BIỆT ---
const FilterBar = () => {
  const years = [];
  for (let i = 2025; i >= 2010; i--) {
    years.push(i);
  }

  return (
    <div className="filter-bar container">
      {/* 1. SEARCH */}
      <div className="filter-group filter-search">
        <label>Search</label>
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input type="text" placeholder="Search anime..." />
        </div>
      </div>

      {/* 2. GENRES */}
      <div className="filter-group filter-genres">
        <label>Genres</label>
        <select>
          <option>Any</option>
          <option>Action</option>
          <option>Adventure</option>
          <option>Comedy</option>
          <option>Drama</option>
        </select>
      </div>

      {/* 3. YEAR */}
      <div className="filter-group filter-year">
        <label>Year</label>
        <select defaultValue="Any">
          <option value="Any">Any</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 4. SEASON */}
      <div className="filter-group filter-season">
        <label>Season</label>
        <select>
          <option>Any</option>
          <option>Winter</option>
          <option>Summer</option>
          <option>Fall</option>
          <option>Spring</option>
        </select>
      </div>

      {/* 5. FORMAT */}
      <div className="filter-group filter-format">
        <label>Format</label>
        <select>
          <option>Any</option>
          <option>TV Show</option>
          <option>Movie</option>
          <option>OVA</option>
        </select>
      </div>

      {/* 6. TOGGLE BUTTON */}
      <div className="filter-toggle">
         <i className="fas fa-th-large"></i>
      </div>
    </div>
  );
};

// ... (Giữ nguyên SectionGrid và AnimeSearchPage)
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