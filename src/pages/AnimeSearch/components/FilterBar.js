import React, { useState } from 'react';
import './FilterBar.css';
import { FaSearch } from 'react-icons/fa';

// [MỚI] Import dữ liệu từ file bên ngoài
// Lưu ý: Hãy chắc chắn đường dẫn './filterData' đúng với nơi bạn lưu file
import { filterData } from '../../../data/FilterData';

const FilterBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const [genre, setGenre] = useState('Any');
  const [year, setYear] = useState('Any');
  const [season, setSeason] = useState('Any');
  const [format, setFormat] = useState('Any');

  // [ĐÃ XÓA] Logic tạo mảng years ở đây đã được chuyển sang file filterData.js

  const handleSearchAction = () => {
    if (onSearch) {
      onSearch(keyword, { genre, year, season, format });
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setKeyword(val);

    if (val === '') {
      if (onSearch) {
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
      {/* 1. SEARCH - Giữ nguyên */}
      <div className="filter-group filter-search">
        <label>Search</label>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search anime..."
            value={keyword}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <div className="search-btn" onClick={handleSearchAction}>
            <FaSearch />
          </div>
        </div>
      </div>

      {/* 2. GENRES - Lấy từ filterData.genres */}
      <div className="filter-group filter-genres">
        <label>Genres</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="Any">Any</option>
          {filterData.genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* 3. YEAR - Lấy từ filterData.years */}
      <div className="filter-group filter-year">
        <label>Year</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="Any">Any</option>
          {filterData.years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 4. SEASON - Lấy từ filterData.seasons */}
      <div className="filter-group filter-season">
        <label>Season</label>
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">Any</option>
          {filterData.seasons.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* 5. FORMAT - Lấy từ filterData.formats */}
      <div className="filter-group filter-format">
        <label>Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="">Any</option>
          {filterData.formats.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default FilterBar;