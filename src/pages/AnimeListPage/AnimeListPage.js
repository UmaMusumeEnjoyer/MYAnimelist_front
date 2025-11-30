// src/pages/AnimeListPage.js
import React from 'react';
import AnimeCard from '../../components/AnimeCard';
import Sidebar from './components/Sidebar';
import { animeList, collaborators } from '../../data/mockDataSearchPage';
import './AnimeListPage.css';

const AnimeListPage = () => {
  return (
    <div className="page-container">
      <div className="main-layout">
        
        {/* LEFT COLUMN: Main Content */}
        <main className="content-area">
          
          {/* Page Header */}
          <div className="page-header">
            <div className="header-text">
              <h1 className="page-title">Our Top Shonen Series</h1>
              <p className="page-description">A collaborative list of the best shonen anime to watch.</p>
            </div>
            {/* Đã xóa action-buttons ở đây */}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar-sticky">
            <div className="search-wrapper">
              <span className="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by title, status, or genre..." 
              />
            </div>
            
            <div className="filter-tabs">
              <button className="tab active">All</button>
              <button className="tab">Watching</button>
              <button className="tab">Completed</button>
              <button className="tab">Plan to Watch</button>
              <button className="tab">Dropped</button>
            </div>
          </div>

          {/* Anime Grid */}
          <div className="anime-grid">
            {animeList.map(anime => (
              <div className="grid-item" key={anime.id}>
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>

        </main>

        {/* RIGHT COLUMN: Sidebar + Buttons */}
        <div className="sidebar-area">
          
          {/* [NEW LOCATION] Action Buttons moved here */}
          <div className="action-buttons sidebar-actions">
              <button className="btn btn-primary">Share</button>
              <button className="btn btn-secondary">Add Anime</button>
              <button className="btn btn-secondary btn-icon">
                 <span className="material-symbols-outlined">palette</span>
                 Customize
              </button>
          </div>

          {/* Owner/Collaborators Section */}
          <Sidebar data={collaborators} />
        </div>

      </div>
    </div>
  );
};

export default AnimeListPage;