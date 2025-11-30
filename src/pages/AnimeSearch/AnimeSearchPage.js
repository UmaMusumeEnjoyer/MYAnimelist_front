import React, { useState } from 'react';
import './AnimeSearchPage.css';

// Import Components
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import SectionGrid from './components/SectionGrid';
import AnimeCard from '../../components/AnimeCard'; 
import { searchAnimeByName } from '../../services/api'; 

// Import Data
import {
  heroList,
  trendingAnime,
  popularSeason,
  upcomingNext,
  allTimePopular
} from '../../data/animeSearchData';

const AnimeSearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (keyword, filters) => {
    const { genre, year, season, format } = filters;
    const isFiltersDefault = 
      genre === 'Any' && 
      year === 'Any' && 
      season === 'Any' && 
      format === 'Any';

    if (keyword && keyword.trim() !== "" && isFiltersDefault) {
      setLoading(true);
      setIsSearching(true);
      
      try {
        const response = await searchAnimeByName(keyword);
        
        // [QUAN TRỌNG] Lấy mảng candidates từ response
        const rawCandidates = response.data.candidates || [];

        // [MỚI] Mapping dữ liệu để khớp với AnimeCard.js
        const mappedResults = rawCandidates.map(item => ({
          // 1. Map ID
          id: item.id,
          anilist_id: item.id, // AnimeCard ưu tiên dùng trường này
          
          // 2. Map Tên (AnimeCard dùng title_romaji)
          title_romaji: item.romaji, 
          english: item.english, // Giữ lại nếu cần dùng sau này
          
          // 3. Map Ảnh (AnimeCard dùng cover_image)
          cover_image: item.cover, 

          // 4. Các thông số khác
          episodes: item.episodes,
          average_score: item.average_score,
          season: item.season,
          
          // Giữ lại toàn bộ data gốc phòng hờ
          ...item
        }));

        setSearchResults(mappedResults);

      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else if (!keyword && isFiltersDefault) {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="anime-search-page">
      <HeroSection slides={heroList} />
      
      <FilterBar onSearch={handleSearch} />

      <div className="page-content">
        {isSearching ? (
          <div className="container anime-section">
            <div className="section-header">
              <h2 className="section-title">Search Results</h2>
            </div>
            
            {loading ? (
              <div style={{color: '#fff', textAlign: 'center', marginTop: '20px'}}>Loading...</div>
            ) : (
              <div className="anime-grid">
                {searchResults.length > 0 ? (
                  searchResults.map((anime) => (
                    <div key={anime.id} className="grid-item">
                      <AnimeCard anime={anime} />
                    </div>
                  ))
                ) : (
                  <div style={{color: '#9FADBD', gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px'}}>
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <SectionGrid title="TRENDING NOW" data={trendingAnime} />
            <SectionGrid title="POPULAR THIS SEASON" data={popularSeason} />
            <SectionGrid title="UPCOMING NEXT SEASON" data={upcomingNext} />
            <SectionGrid title="ALL TIME POPULAR" data={allTimePopular} />
          </>
        )}
      </div>
    </div>
  );
};

export default AnimeSearchPage;