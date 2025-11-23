// src/components/AnimeSection.js
import React from 'react';
import AnimeCard from '../../../components/AnimeCard';
import './AnimeSection.css';

const AnimeSection = ({ title, animeList }) => {
  return (
    <section className="anime-section">
      <h2 className="section-title">{title}</h2>
      <div className="anime-grid">
        {animeList.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
};

export default AnimeSection;