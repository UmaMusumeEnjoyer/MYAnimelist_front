import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './AnimeSearchPage.css';

// Import Components
import HeroSection from './components/HeroSection';
import FilterBar from './components/FilterBar';
import SectionGrid from './components/SectionGrid';
import AnimeCard from '../../components/AnimeCard'; 

// Import API
import { searchAnimeByName, searchAnimeByCriteria, getTrendingAnime } from '../../services/api'; 

// Import Utils
import { getCurrentSeasonInfo, getNextSeasonInfo } from '../../utils/seasonUtils';

// Import Data
import {
  heroList,
  trendingAnime,
  popularSeason,
  upcomingNext,
  allTimePopular
} from '../../data/animeSearchData';

const SESSION_KEY = 'ANIME_SEARCH_STATE';

const AnimeSearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [viewTitle, setViewTitle] = useState('Search Results');
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(null); 

  // --- 1. RESTORE STATE KHI COMPONENT MOUNT ---
  useEffect(() => {
    const savedState = sessionStorage.getItem(SESSION_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setSearchResults(parsed.searchResults);
        setIsSearching(parsed.isSearching);
        setViewTitle(parsed.viewTitle);
        setPage(parsed.page);
        setCanLoadMore(parsed.canLoadMore);
        setCurrentFilters(parsed.currentFilters);
        
        if (parsed.isSearching) {
            setTimeout(() => {
                window.scrollTo({ top: 400, behavior: 'smooth' });
            }, 100);
        }
      } catch (error) {
        console.error("Failed to restore search state", error);
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  // --- 2. AUTO SAVE STATE KHI DATA THAY ĐỔI ---
  useEffect(() => {
    if (isSearching) {
      const stateToSave = {
        searchResults,
        isSearching,
        viewTitle,
        page,
        canLoadMore,
        currentFilters
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateToSave));
    }
  }, [searchResults, isSearching, viewTitle, page, canLoadMore, currentFilters]);

  // --- MAP DATA HELPER ---
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
  });

  // --- SEARCH HANDLER ---
  const handleSearch = async (keyword, filters) => {
    // [MỚI] Destructure thêm status và sort
    const { genre, year, season, format, status, sort } = filters;
    
    // Kiểm tra xem có filter nào đang được active không
    const hasFilter = 
      (genre && genre !== 'Any') ||
      (year && year !== 'Any') ||
      (season && season !== 'Any') ||
      (format && format !== 'Any') ||
      (status && status !== 'Any');
      // Sort thường luôn có giá trị mặc định nên ta không nhất thiết tính là 'hasFilter' 
      // trừ khi muốn logic chặt chẽ hơn. Ở đây ta ưu tiên logic Search Text vs Filter.

    // Nếu không có gì để search -> Về trang chủ
    if ((!keyword || keyword.trim() === "") && !hasFilter) {
      handleBackToHome(); 
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setViewTitle('Search Results');
    setSearchResults([]); 
    setPage(1);
    
    setCurrentFilters({ keyword, filters, hasFilter });

    try {
      let mappedResults = [];

      // Logic: Nếu có filter hoặc cần sort, ta dùng searchAnimeByCriteria
      // (Giả sử API searchByCriteria của bạn hỗ trợ tham số search text và sort)
      if (hasFilter || (sort && sort !== 'POPULARITY_DESC')) {
        const criteriaBody = { page: 1, perpage: 20 };
        
        if (year && year !== 'Any') criteriaBody.year = parseInt(year);
        if (season && season !== 'Any') criteriaBody.season = season;
        if (format && format !== 'Any') criteriaBody.format = format;
        if (genre && genre !== 'Any') criteriaBody.genres = genre;
        
        // [MỚI] Thêm status
        if (status && status !== 'Any') criteriaBody.status = status;

        // [MỚI] Thêm sort
        if (sort) criteriaBody.sort = sort;

        // Nếu có keyword đi kèm filter, ta gửi thêm keyword (nếu API hỗ trợ)
        // Nếu API criteria không hỗ trợ 'search' text, bạn cần cân nhắc logic backend
        if (keyword && keyword.trim() !== "") criteriaBody.search = keyword;
        
        const response = await searchAnimeByCriteria(criteriaBody);
        const rawResults = response.data.results || [];
        mappedResults = rawResults.map(mapAnimeData);
        setCanLoadMore(rawResults.length === 20);
      } 
      // Chỉ search theo tên thuần túy (không filter, sort mặc định)
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

  // --- VIEW ALL HANDLER ---
  const handleViewAllClick = async (type) => {
    // Reset session cũ
    sessionStorage.removeItem(SESSION_KEY);

    if (type === 'TRENDING_NOW') {
        setLoading(true);
        setIsSearching(true);
        setViewTitle('Trending Now');
        setSearchResults([]);
        setPage(1);
        setCurrentFilters(null); 
        
        try {
            const response = await getTrendingAnime();
            const rawResults = response.data.trending || []; 
            setSearchResults(rawResults.map(mapAnimeData));
            setCanLoadMore(false); 
        } catch (error) {
            console.error("Fetch trending failed:", error);
        } finally {
            setLoading(false);
        }
        window.scrollTo({ top: 400, behavior: 'smooth' });
        return; 
    }

    // [MỚI] Cập nhật default filters có thêm status và sort
    let targetFilters = { 
        genre: 'Any', 
        year: 'Any', 
        season: 'Any', 
        format: 'Any', 
        status: 'Any', 
        sort: 'POPULARITY_DESC' 
    };

    if (type === 'POPULAR_THIS_SEASON') {
      const { year, season } = getCurrentSeasonInfo();
      targetFilters = { ...targetFilters, year, season };
    } 
    else if (type === 'UPCOMING_NEXT_SEASON') {
      const { year, season } = getNextSeasonInfo();
      targetFilters = { ...targetFilters, year, season };
    }

    handleSearch('', targetFilters);
    
    if (type === 'POPULAR_THIS_SEASON') setViewTitle('Popular This Season');
    if (type === 'UPCOMING_NEXT_SEASON') setViewTitle('Upcoming Next Season');

    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // --- BACK BUTTON HANDLER ---
  const handleBackToHome = () => {
    sessionStorage.removeItem(SESSION_KEY);

    setIsSearching(false);
    setSearchResults([]);
    setPage(1);
    
    // [MỚI] Reset về trạng thái mặc định đầy đủ
    setCurrentFilters({
      keyword: '',
      filters: { 
          genre: 'Any', 
          year: 'Any', 
          season: 'Any', 
          format: 'Any', 
          status: 'Any', 
          sort: 'POPULARITY_DESC' 
      }
    });
  };

  const handleLoadMore = async () => {
    if (!currentFilters) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const { filters } = currentFilters;
      // [MỚI] Lấy thêm status và sort
      const { genre, year, season, format, status, sort } = filters;

      const criteriaBody = { page: nextPage, perpage: 20 };
      
      if (year && year !== 'Any') criteriaBody.year = parseInt(year);
      if (season && season !== 'Any') criteriaBody.season = season;
      if (format && format !== 'Any') criteriaBody.format = format;
      if (genre && genre !== 'Any') criteriaBody.genres = genre;
      
      // [MỚI] Gửi status và sort khi load more
      if (status && status !== 'Any') criteriaBody.status = status;
      if (sort) criteriaBody.sort = sort;

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
            
            <div className="search-results-header">
              <h2 className="section-title">{viewTitle}</h2>
              <button className="back-btn" onClick={handleBackToHome}>
                <FaArrowLeft /> Back
              </button>
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
            <SectionGrid 
                title="TRENDING NOW" 
                data={trendingAnime} 
                onViewAll={() => handleViewAllClick('TRENDING_NOW')}
            />
            
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