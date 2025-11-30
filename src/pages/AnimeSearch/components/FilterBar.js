import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { FaSearch } from 'react-icons/fa';
import { filterData } from '../../../data/FilterData';

// [MỚI] Thêm prop 'activeFilters' để nhận giá trị từ cha
const FilterBar = ({ onSearch, activeFilters }) => {
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('Any');
  const [year, setYear] = useState('Any');
  const [season, setSeason] = useState('Any');
  const [format, setFormat] = useState('Any');

  // [MỚI] Sync state khi activeFilters thay đổi (Từ nút View All)
  useEffect(() => {
    if (activeFilters) {
      if (activeFilters.filters.year) setYear(activeFilters.filters.year);
      if (activeFilters.filters.season) setSeason(activeFilters.filters.season);
      if (activeFilters.filters.genre) setGenre(activeFilters.filters.genre);
      if (activeFilters.filters.format) setFormat(activeFilters.filters.format);
      // Nếu có keyword thì set, không thì reset về rỗng
      setKeyword(activeFilters.keyword || '');
    }
  }, [activeFilters]);

  // --- GIỮ NGUYÊN LOGIC CŨ ---
  const handleSearchAction = () => {
    if (onSearch) {
      onSearch(keyword, { genre, year, season, format });
    }
  };

  const handleFilterChange = (key, value) => {
    // Update local state
    if (key === 'genre') setGenre(value);
    if (key === 'year') setYear(value);
    if (key === 'season') setSeason(value);
    if (key === 'format') setFormat(value);

    // Prepare data to send
    const updatedFilters = {
      genre: key === 'genre' ? value : genre,
      year: key === 'year' ? value : year,
      season: key === 'season' ? value : season,
      format: key === 'format' ? value : format,
    };

    // Trigger search
    if (onSearch) {
      onSearch(keyword, updatedFilters);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (val === '') {
      if (onSearch) onSearch('', { genre, year, season, format });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchAction();
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
            onChange={handleInputChange}
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
        <select value={genre} onChange={(e) => handleFilterChange('genre', e.target.value)}>
          <option value="Any">Any</option>
          {filterData.genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* 3. YEAR */}
      <div className="filter-group filter-year">
        <label>Year</label>
        <select value={year} onChange={(e) => handleFilterChange('year', e.target.value)}>
          <option value="Any">Any</option>
          {filterData.years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* 4. SEASON */}
      <div className="filter-group filter-season">
        <label>Season</label>
        <select value={season} onChange={(e) => handleFilterChange('season', e.target.value)}>
          <option value="">Any</option>
          {filterData.seasons.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* 5. FORMAT */}
      <div className="filter-group filter-format">
        <label>Format</label>
        <select value={format} onChange={(e) => handleFilterChange('format', e.target.value)}>
          <option value="">Any</option>
          {filterData.formats.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;