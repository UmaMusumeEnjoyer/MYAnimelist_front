import React, { useState } from 'react';
import './FilterBar.css';
import { FaSearch, FaThLarge } from 'react-icons/fa';

const FilterBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  
  const [genre, setGenre] = useState('Any');
  const [year, setYear] = useState('Any');
  const [season, setSeason] = useState('Any');
  const [format, setFormat] = useState('Any');

  const years = [];
  for (let i = 2025; i >= 2010; i--) {
    years.push(i);
  }

  const handleSearchAction = () => {
    if (onSearch) {
      onSearch(keyword, { genre, year, season, format });
    }
  };

  // [MỚI] Hàm xử lý khi thay đổi text
  const handleInputChange = (e) => {
    const val = e.target.value;
    setKeyword(val);

    // LOGIC MỚI: Nếu xóa hết chữ (chuỗi rỗng), gọi onSearch ngay lập tức để reset giao diện
    if (val === '') {
      if (onSearch) {
        // Truyền keyword rỗng để component cha biết và quay về Default View
        onSearch('', { genre, year, season, format });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchAction();
    }
  };

  return (
    <div className="filter-bar container">
      {/* 1. SEARCH */}
      <div className="filter-group filter-search">
        <label>Search</label>
        <div className="search-box">
          
          <input 
            type="text" 
            placeholder="Search anime..." 
            value={keyword}
            onChange={handleInputChange} /* [THAY ĐỔI] Dùng hàm mới handleInputChange */
            onKeyDown={handleKeyDown} 
          />
          <div className="search-btn" onClick={handleSearchAction}>
          <FaSearch />
          </div>
        </div>
      </div>

      {/* 2. GENRES */}
      <div className="filter-group filter-genres">
        <label>Genres</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="Any">Any</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
        </select>
      </div>

      {/* 3. YEAR */}
      <div className="filter-group filter-year">
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="Any">Any</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* 4. SEASON */}
      <div className="filter-group filter-season">
        <label>Season</label>
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="Any">Any</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
        </select>
      </div>

      {/* 5. FORMAT */}
      <div className="filter-group filter-format">
        <label>Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="Any">Any</option>
          <option value="TV Show">TV Show</option>
          <option value="Movie">Movie</option>
          <option value="OVA">OVA</option>
        </select>
      </div>

      <div className="filter-toggle">
         <FaThLarge />
      </div>
    </div>
  );
};

export default FilterBar;