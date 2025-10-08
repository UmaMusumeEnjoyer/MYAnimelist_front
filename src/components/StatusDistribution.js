// src/components/StatusDistribution.js
import React from 'react';
import './StatusDistribution.css';

// Định nghĩa màu sắc cho từng trạng thái
const statusConfig = {
  PLANNING: { color: 'rgb(2, 169, 255)', order: 1 },
  CURRENT: { color: 'rgb(146, 86, 243)', order: 2 },
  DROPPED: { color: 'rgb(247, 121, 164)', order: 4 },
  PAUSED: { color: '#E91E63', order: 3 },
  COMPLETED: { color: 'rgb(104, 214, 57)', order: 5 },
};

const StatusDistribution = ({ distribution }) => {
  if (!distribution || distribution.length === 0) {
    return <p>No status distribution data available.</p>;
  }

  // Sắp xếp các mục theo thứ tự đã định nghĩa
  const sortedDistribution = [...distribution].sort((a, b) => {
    return (statusConfig[a.status]?.order || 99) - (statusConfig[b.status]?.order || 99);
  });

  const totalUsers = sortedDistribution.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="status-dist-container">
      <div className="status-legend">
        {sortedDistribution.map(({ status, amount }) => (
          <div key={status} className="legend-item">
            <button className="legend-button" style={{ backgroundColor: statusConfig[status]?.color }}>
              {status}
            </button>
            <p className="legend-users">{amount.toLocaleString()} Users</p>
          </div>
        ))}
      </div>
      <div className="status-progress-bar">
        {sortedDistribution.map(({ status, amount }) => (
          <div
            key={status}
            className="progress-segment"
            style={{
              width: `${(amount / totalUsers) * 100}%`,
              backgroundColor: statusConfig[status]?.color,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistribution;