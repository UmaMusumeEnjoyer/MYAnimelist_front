import React from 'react';
import './FilterBar.css';

const FilterBar = () => {
  const years = [];
  for (let i = 2025; i >= 2010; i--) {
    years.push(i);
  }

  return (
    <div className="filter-bar container">
      {/* 1. SEARCH */}
      <div className="filter-group filter-search">
        <label>Search</label>
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input type="text" placeholder="Search anime..." />
        </div>
      </div>

      {/* 2. GENRES */}
      <div className="filter-group filter-genres">
        <label>Genres</label>
        <select>
          <option>Any</option>
          <option>Action</option>
          <option>Adventure</option>
          <option>Comedy</option>
          <option>Drama</option>
        </select>
      </div>

      {/* 3. YEAR */}
      <div className="filter-group filter-year">
        <label>Year</label>
        <select defaultValue="Any">
          <option value="Any">Any</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* 4. SEASON */}
      <div className="filter-group filter-season">
        <label>Season</label>
        <select>
          <option>Any</option>
          <option>Winter</option>
          <option>Spring</option>
          <option>Summer</option>
          <option>Fall</option>
        </select>
      </div>

      {/* 5. FORMAT */}
      <div className="filter-group filter-format">
        <label>Format</label>
        <select>
          <option>Any</option>
          <option>TV Show</option>
          <option>Movie</option>
          <option>OVA</option>
        </select>
      </div>

      {/* 6. TOGGLE BUTTON */}
      <div className="filter-toggle">
         <i className="fas fa-th-large"></i>
      </div>
    </div>
  );
};

export default FilterBar;