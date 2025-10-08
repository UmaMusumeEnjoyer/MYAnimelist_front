// src/components/MainContentArea.js
import React from 'react';
import './MainContentArea.css';
import CharactersSection from './CharactersSection'; 

const Section = ({ title, children }) => (
  <section className="content-section">
    <h3 className="section-title">{title}</h3>
    {children}
  </section>
);

const Trailer = ({ trailerInfo }) => {
  if (!trailerInfo || !trailerInfo.id || trailerInfo.site !== 'youtube') {
    return <p>No trailer available.</p>;
  }
  const embedUrl = `https://www.youtube.com/embed/${trailerInfo.id}`;
  return (
    <div className="trailer-container">
      <iframe
        src={embedUrl}
        title="Anime Trailer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const MainContentArea = ({ anime }) => {
  return (
    <main className="main-content-area">
      {/* Các component khác như Relations, Characters sẽ được thêm vào đây */}
      {/* ... */}

      
      {/* Placeholder cho các phần khác */}
      <Section title="Characters">
        <CharactersSection animeId={anime.id} />
      </Section>
      <Section title="Staff">
        <p>Staff information will be displayed here.</p>
      </Section>

      <Section title="Trailer">
        <Trailer trailerInfo={anime.trailer} />
      </Section>
    </main>
  );
};

export default MainContentArea;