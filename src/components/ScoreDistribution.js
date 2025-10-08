// src/components/ScoreDistribution.js
import React from 'react';
import './ScoreDistribution.css';

const ScoreDistribution = ({ distribution }) => {
  if (!distribution || distribution.length === 0) {
    return <p>No score distribution data available.</p>;
  }

  // Tìm ra số lượng user cao nhất để tính tỉ lệ chiều cao cho các cột
  const maxAmount = Math.max(...distribution.map(item => item.amount));

  // Hàm để chọn màu dựa trên điểm số
  const getScoreColor = (score) => {
    if (score <= 40) return '#E84F63'; // Đỏ
    if (score <= 60) return '#FBC02D'; // Vàng
    if (score <= 80) return '#8BC34A'; // Xanh lá nhạt
    return '#4CAF50'; // Xanh lá đậm
  };

  return (
    <div className="score-dist-container">
      <div className="score-chart">
        {distribution.map(({ score, amount }) => (
          <div key={score} className="chart-bar-item">
            <span className="bar-amount">{amount.toLocaleString()}</span>
            <div className="bar-element-container">
              <div
                className="bar-element"
                style={{
                  height: `${(amount / maxAmount) * 100}%`,
                  backgroundColor: getScoreColor(score),
                }}
              ></div>
            </div>
            <span className="bar-score">{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDistribution;