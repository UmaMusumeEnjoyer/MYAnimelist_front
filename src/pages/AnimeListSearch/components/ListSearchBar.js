import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../AnimeListSearchPage.css'; // Chúng ta sẽ gộp CSS vào 1 file cho trang này hoặc tách riêng tùy bạn

const ListSearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearchAction = () => {
    if (onSearch) onSearch(keyword);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchAction();
  };

  return (
    <div className="list-search-bar container">
      {/* Search Input Box - Reusing styles similar to FilterBar */}
      <div className="ls-search-group">
        <label>Search Lists</label>
        <div className="ls-search-box">
          <input
            type="text"
            placeholder="Find a list (e.g., 'Best Isekai 2024')..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="ls-search-btn" onClick={handleSearchAction}>
            <FaSearch />
          </div>
        </div>
      </div>

      {/* Sort Option (Optional addition specific to Lists) */}

    </div>
  );
};

export default ListSearchBar;