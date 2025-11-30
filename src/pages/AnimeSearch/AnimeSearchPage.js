import React, { useState } from 'react';
import './AnimeSearchPage.css';

// Import Components
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import SectionGrid from './components/SectionGrid';
import AnimeCard from '../../components/AnimeCard'; 

// Import API
import { searchAnimeByName, searchAnimeByCriteria } from '../../services/api'; 

// [MỚI] Import Utils xử lý mùa
import { getCurrentSeasonInfo, getNextSeasonInfo } from '../../utils/seasonUtils';

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

  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(false);
  
  const [currentFilters, setCurrentFilters] = useState(null); 

  // --- [ĐÃ XÓA] Hàm calculateSeason cũ vì đã chuyển sang file utils ---

  const mapAnimeData = (rawItem) => ({
    id: rawItem.id,
    anilist_id: rawItem.id,
    title_romaji: rawItem.name_romaji || rawItem.romaji,
    english: rawItem.name_english || rawItem.english,
    cover_image: rawItem.cover_image || rawItem.cover,
    episodes: rawItem.airing_episodes || rawItem.episodes,
    average_score: rawItem.average_score,
    season: rawItem.season,
    next_airing_ep: null, 
    ...rawItem,
    next_airing_ep: null 
  });

  const handleSearch = async (keyword, filters) => {
    const { genre, year, season, format } = filters;
    
    const hasFilter = 
      (genre && genre !== 'Any') ||
      (year && year !== 'Any') ||
      (season && season !== 'Any') ||
      (format && format !== 'Any');

    if ((!keyword || keyword.trim() === "") && !hasFilter) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setSearchResults([]); 
    setPage(1);
    
    setCurrentFilters({ keyword, filters, hasFilter });

    try {
      let mappedResults = [];

      if (hasFilter) {
        const criteriaBody = { page: 1, perpage: 20 };
        if (year && year !== 'Any') criteriaBody.year = parseInt(year);
        if (season && season !== 'Any') criteriaBody.season = season;
        if (format && format !== 'Any') criteriaBody.format = format;
        if (genre && genre !== 'Any') criteriaBody.genre = genre;
        
        const response = await searchAnimeByCriteria(criteriaBody);
        const rawResults = response.data.results || [];
        mappedResults = rawResults.map(mapAnimeData);
        setCanLoadMore(rawResults.length === 20);
      } 
      else if (keyword && keyword.trim() !== "") {
        const response = await searchAnimeByName(keyword);
        const rawCandidates = response.data.candidates || [];
        mappedResults = rawCandidates.map(mapAnimeData);
        setCanLoadMore(false);
      }

      setSearchResults(mappedResults);

    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setCanLoadMore(false);
    } finally {
      setLoading(false);
    }
  };

  // === [CẬP NHẬT] SỬ DỤNG UTILS MỚI ===
  const handleViewAllClick = (type) => {
    let targetFilters = { genre: 'Any', year: 'Any', season: 'Any', format: 'Any' };

    if (type === 'POPULAR_THIS_SEASON') {
      // Sử dụng hàm từ utils
      const { year, season } = getCurrentSeasonInfo();
      targetFilters = { ...targetFilters, year, season };
    } 
    else if (type === 'UPCOMING_NEXT_SEASON') {
      // Sử dụng hàm từ utils (đã bao gồm logic chuyển năm)
      const { year, season } = getNextSeasonInfo();
      targetFilters = { ...targetFilters, year, season };
    }

    // Gọi hàm search với bộ lọc mới
    handleSearch('', targetFilters);
    
    // Cuộn lên đầu trang (FilterBar)
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleLoadMore = async () => {
    if (!currentFilters) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const { filters } = currentFilters;
      const { genre, year, season, format } = filters;

      const criteriaBody = { page: nextPage, perpage: 20 };
      if (year && year !== 'Any') criteriaBody.year = parseInt(year);
      if (season && season !== 'Any') criteriaBody.season = season;
      if (format && format !== 'Any') criteriaBody.format = format;
      if (genre && genre !== 'Any') criteriaBody.genre = genre;

      const response = await searchAnimeByCriteria(criteriaBody);
      const rawResults = response.data.results || [];
      const newMappedResults = rawResults.map(mapAnimeData);

      setSearchResults(prev => [...prev, ...newMappedResults]); 
      setPage(nextPage); 
      
      if (rawResults.length < 20) setCanLoadMore(false);

    } catch (error) {
      console.error("Load more failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anime-search-page">
      <HeroSection slides={heroList} />
      
      <FilterBar onSearch={handleSearch} activeFilters={currentFilters} />

      <div className="page-content">
        {isSearching ? (
          <div className="container anime-section">
            <div className="section-header">
              <h2 className="section-title">Search Results</h2>
            </div>
            
            <div className="anime-grid">
              {searchResults.length > 0 ? (
                searchResults.map((anime, index) => (
                  <div key={`${anime.id}-${index}`} className="grid-item">
                    <AnimeCard anime={anime} />
                  </div>
                ))
              ) : (
                !loading && (
                  <div style={{color: '#9FADBD', gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px'}}>
                    No results found based on your filters.
                  </div>
                )
              )}
            </div>

            {loading && <div style={{color: '#fff', textAlign: 'center', margin: '20px 0'}}>Loading...</div>}

            {!loading && canLoadMore && searchResults.length > 0 && (
              <div className="load-more-container">
                <button className="btn-see-more" onClick={handleLoadMore}>See more</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <SectionGrid title="TRENDING NOW" data={trendingAnime} />
            
            <SectionGrid 
              title="POPULAR THIS SEASON" 
              data={popularSeason} 
              onViewAll={() => handleViewAllClick('POPULAR_THIS_SEASON')}
            />
            
            <SectionGrid 
              title="UPCOMING NEXT SEASON" 
              data={upcomingNext} 
              onViewAll={() => handleViewAllClick('UPCOMING_NEXT_SEASON')}
            />
            
            <SectionGrid title="ALL TIME POPULAR" data={allTimePopular} />
          </>
        )}
      </div>
    </div>
  );
};

export default AnimeSearchPage;