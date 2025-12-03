import React, { useState, useEffect } from 'react';
import ListSearchBar from './components/ListSearchBar'; 
import TopListsSection from './components/TopListsSection';
import SearchListCard from './components/SearchListCard'; // Import component mới
import { getMostLikedLists, searchCustomLists } from '../../services/api'; 
import './AnimeListSearchPage.css';

const AnimeListSearchPage = () => {
  // State cho Top Lists (Mặc định)
  const [topLists, setTopLists] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  // State cho Search Results
  const [searchResults, setSearchResults] = useState([]);
  const [searchMetadata, setSearchMetadata] = useState(null); // Lưu total, has_more...
  const [isSearching, setIsSearching] = useState(false); // Cờ để biết đang ở chế độ search hay không
  const [loadingSearch, setLoadingSearch] = useState(false);

  // 1. Fetch Top Lists khi mount
  useEffect(() => {
    const fetchTopLists = async () => {
      try {
        const response = await getMostLikedLists();
        if (response.data && response.data.most_liked_lists) {
          setTopLists(response.data.most_liked_lists);
        }
      } catch (error) {
        console.error("Error fetching most liked lists:", error);
      } finally {
        setLoadingTop(false);
      }
    };

    fetchTopLists();
  }, []);

  // 2. Xử lý Search
  const handleSearch = async (keyword) => {
    // Nếu keyword rỗng, quay về chế độ hiển thị Top Lists
    if (!keyword || keyword.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    console.log("Searching for lists:", keyword);
    setLoadingSearch(true);
    setIsSearching(true); // Bật chế độ search

    try {
      const response = await searchCustomLists(keyword);
      // Response structure: 
      // { data: { query: "...", lists: [...], total: 1, ... } }
      
      if (response.data && response.data.lists) {
        setSearchResults(response.data.lists);
        setSearchMetadata({
            total: response.data.total,
            showing: response.data.showing
        });
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching lists:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="anime-list-search-page">
      <div className="list-page-header container">
        <h1>Discover Anime Lists</h1>
        <p>Curated collections from the community</p>
      </div>

      <ListSearchBar onSearch={handleSearch} />

      <div className="page-content container">
        {/* LOGIC HIỂN THỊ CÓ ĐIỀU KIỆN */}
        
        {isSearching ? (
          // --- VIEW 1: SEARCH RESULTS ---
          <section className="search-results-section">
            <h2 className="section-title">
              {loadingSearch ? 'Searching...' : `Search Results ${searchMetadata ? `(${searchMetadata.total})` : ''}`}
            </h2>

            {loadingSearch ? (
               <p>Looking for lists...</p>
            ) : searchResults.length > 0 ? (
              <div className="lists-grid">
                {searchResults.map((list) => (
                  // Dùng Component SearchListCard mới cho kết quả tìm kiếm
                  <SearchListCard key={list.list_id} listData={list} />
                ))}
              </div>
            ) : (
              <p style={{color: '#8BA0B2'}}>No lists found matching your query.</p>
            )}
          </section>

        ) : (
          // --- VIEW 2: TOP LISTS (DEFAULT) ---
          loadingTop ? (
            <p>Loading top lists...</p>
          ) : (
            <TopListsSection title="Most Liked Lists" lists={topLists} />
          )
        )}
      </div>
    </div>
  );
};

export default AnimeListSearchPage;