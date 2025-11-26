import React from 'react';
import './ActivityHistory.css';

const ActivityHistory = () => {
  const dots = Array.from({ length: 70 }, (_, i) => ({
    id: i,
    active: Math.random() > 0.6
  }));

  return (
    <div className="sidebar-section">
      <div className="section-title">Activity History</div>
      <div className="activity-grid">
        {dots.map(dot => (
          <div key={dot.id} className={`act-dot ${dot.active ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
};
export default ActivityHistory;