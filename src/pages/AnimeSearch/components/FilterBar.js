import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import { FaSearch, FaSyncAlt } from 'react-icons/fa'; // [MỚI] Import icon Reset
import { filterData } from '../../../data/FilterData';

const FilterBar = ({ onSearch, activeFilters }) => {
  const [keyword, setKeyword] = useState('');
  const [genre, setGenre] = useState('Any');
  const [year, setYear] = useState('Any');
  const [season, setSeason] = useState('Any');
  const [format, setFormat] = useState('Any');
  const [status, setStatus] = useState('Any'); // [MỚI] State cho Status
  const [sort, setSort] = useState('POPULARITY_DESC');

  useEffect(() => {
    if (activeFilters) {
      if (activeFilters.filters.year) setYear(activeFilters.filters.year);
      if (activeFilters.filters.season) setSeason(activeFilters.filters.season);
      if (activeFilters.filters.genre) setGenre(activeFilters.filters.genre);
      if (activeFilters.filters.format) setFormat(activeFilters.filters.format);
      if (activeFilters.filters.status) setStatus(activeFilters.filters.status);
      if (activeFilters.filters.sort) setSort(activeFilters.filters.sort);
      setKeyword(activeFilters.keyword || '');
    }
  }, [activeFilters]);

  const handleSearchAction = () => {
    if (onSearch) {
      onSearch(keyword, { genre, year, season, format, status, sort});
    }
  };

  // [MỚI] Hàm Reset Filter
  const handleClear = () => {
    // 1. Reset local state
    setKeyword('');
    setGenre('Any');
    setYear('Any');
    setSeason('Any');
    setFormat('Any');
    setStatus('Any');

    // 2. Trigger search với giá trị rỗng (để Parent component reset về Home)
    if (onSearch) {
      onSearch('', { genre: 'Any', year: 'Any', season: 'Any', format: 'Any', status: 'Any', sort: 'POPULARITY_DESC' });
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'genre') setGenre(value);
    if (key === 'year') setYear(value);
    if (key === 'season') setSeason(value);
    if (key === 'format') setFormat(value);
    if (key === 'status') setStatus(value);
    if (key === 'sort') setSort(value); // [MỚI]
    const updatedFilters = {
      genre: key === 'genre' ? value : genre,
      year: key === 'year' ? value : year,
      season: key === 'season' ? value : season,
      format: key === 'format' ? value : format,
      status: key === 'status' ? value : status,
      sort: key === 'sort' ? value : sort, // [MỚI]
    };

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
          <option value="Any">Any</option>
          {filterData.seasons.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* 5. FORMAT */}
      <div className="filter-group filter-format">
        <label>Format</label>
        <select value={format} onChange={(e) => handleFilterChange('format', e.target.value)}>
          <option value="Any">Any</option>
          {filterData.formats.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-group filter-status">
        <label>Status</label>
        <select value={status} onChange={(e) => handleFilterChange('status', e.target.value)}>
          <option value="Any">Any</option>
          {filterData.statuses.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-group filter-sort">
        <label>Sort</label>
        <select value={sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
          {filterData.sorts.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* [MỚI] 6. CLEAR BUTTON */}
      <div className="filter-group filter-clear" style={{ display: 'flex', alignItems: 'flex-end' }}>
        <button 
          onClick={handleClear}
          className="btn-clear-filter"
          title="Reset Filters"
        >
          <FaSyncAlt style={{ marginRight: '5px' }} /> Clear
        </button>
      </div>
    </div>
  );
};

export default FilterBar;