import React from 'react';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1, type: "Watched episode", series: "Crayon Shin-chan",
      detail: "episode 3 of", time: "22 hours ago",
      image: "https://via.placeholder.com/100x150/e85d75/fff?text=Shin"
    },
    {
      id: 2, type: "Plans to watch", series: "Replica: Delio, Kaeru Beso",
      detail: "", time: "4 days ago",
      image: "https://via.placeholder.com/100x150/3db4f2/fff?text=Replica"
    }
    // Thêm các item khác...
  ];

  return (
    <div className="feed-container">
      {activities.map(item => (
        <div key={item.id} className="feed-item">
          <img src={item.image} alt={item.series} className="feed-thumb" />
          <div className="feed-content">
            <div className="feed-text">
              {item.type} {item.detail} <span className="highlight">{item.series}</span>
            </div>
            <div className="feed-meta">{item.time}</div>
          </div>
        </div>
      ))}
      <div className="load-more-btn">Load More</div>
    </div>
  );
};
export default ActivityFeed;