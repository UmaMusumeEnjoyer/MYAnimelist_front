import React from 'react';
import './StatsOverview.css';

const StatsOverview = () => {
  const stats = [
    { label: "Total Anime", value: 651, color: "#4cca51" },
    { label: "Days Watched", value: 98.4, color: "#3db4f2" },
    { label: "Episodes Watched", value: 5630, color: "#e85d75" }
  ];

  return (
    <div className="stats-row">
      {stats.map((stat, idx) => (
        <div key={idx} className="stat-box">
          <span className="stat-value" style={{color: stat.color}}>{stat.value}</span>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
export default StatsOverview;