import React from 'react';
import AnimeListCard from './AnimeListCard';
import '../AnimeListSearchPage.css';

const TopListsSection = ({ title, lists }) => {
  return (
    <section className="top-lists-section container">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        {/* Có thể thêm nút View All ở đây nếu cần */}
      </div>
      
      <div className="lists-grid">
        {lists.map((list) => (
          <AnimeListCard key={list.id} listData={list} />
        ))}
      </div>
    </section>
  );
};

export default TopListsSection;