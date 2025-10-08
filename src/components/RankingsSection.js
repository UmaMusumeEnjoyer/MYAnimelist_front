// src/components/RankingsSection.js
import React from 'react';
import RankingCard from './RankingCard';
import './RankingsSection.css';

// Component giờ nhận `rankings` từ props
const RankingsSection = ({ rankings }) => {
  if (!rankings || rankings.length === 0) {
    return <p>No rankings available.</p>;
  }

  // Lọc ra các ranking không phải "all_time" để hiển thị
  const filteredRankings = rankings.filter(r => !r.all_time);

  return (
    <div className="rankings-grid">
      {filteredRankings.map(rank => (
        <RankingCard key={rank.id} ranking={rank} />
      ))}
    </div>
  );
};

export default RankingsSection;