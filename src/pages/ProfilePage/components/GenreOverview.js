import React from 'react';
import './GenreOverview.css';

const GenreOverview = () => {
  const genres = [
    { name: "Slice of Life", count: 156, color: "#4cca51", width: "40%" },
    { name: "Comedy", count: 214, color: "#3db4f2", width: "30%" },
    { name: "Drama", count: 211, color: "#a0b1c5", width: "20%" },
    { name: "Action", count: 107, color: "#e85d75", width: "10%" }
  ];

  return (
    <div className="sidebar-section">
      <div className="section-title">Genre Overview</div>
      <div className="genre-bar">
        {genres.map((g, idx) => (
          <div key={idx} className="genre-segment" style={{ width: g.width, backgroundColor: g.color }} />
        ))}
      </div>
      <div className="genre-legend">
        {genres.map((g, idx) => (
            idx < 4 && 
            <div key={idx} className="genre-badge" style={{color: g.color}}>
               {g.name} <span style={{color: '#fff'}}>{g.count}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
export default GenreOverview;