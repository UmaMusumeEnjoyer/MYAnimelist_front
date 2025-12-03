import React, { useState, useEffect } from 'react';
import ListSearchBar from './components/ListSearchBar'; 
import TopListsSection from './components/TopListsSection';
import { getMostLikedLists } from '../../services/api'; // Đảm bảo đường dẫn import đúng tới file api.js của bạn
import './AnimeListSearchPage.css';

const AnimeListSearchPage = () => {
  const [topLists, setTopLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchTopLists = async () => {
      try {
        const response = await getMostLikedLists();
        // Cấu trúc response: { data: { total: 1, most_liked_lists: [...] } }
        if (response.data && response.data.most_liked_lists) {
          setTopLists(response.data.most_liked_lists);
        }
      } catch (error) {
        console.error("Error fetching most liked lists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopLists();
  }, []);

  const handleSearch = (keyword) => {
    console.log("Searching for lists:", keyword);
    // Logic search có thể triển khai sau
  };

  return (
    <div className="anime-list-search-page">
      <div className="list-page-header container">
        <h1>Discover Anime Lists</h1>
        <p>Curated collections from the community</p>
      </div>

      <ListSearchBar onSearch={handleSearch} />

      <div className="page-content">
        {loading ? (
          <p className="container">Loading lists...</p>
        ) : (
          <TopListsSection title="Most Liked Lists" lists={topLists} />
        )}
      </div>
    </div>
  );
};

export default AnimeListSearchPage;