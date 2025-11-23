// src/components/MainContentArea.js
import React, { useState, useEffect } from 'react';
import './MainContentArea.css';
import { getAnimeStats } from '../../../services/api'; // Import service
import CharactersSection from './CharactersSection';
import StaffSection from './StaffSection';
import RankingsSection from './RankingsSection';
import StatusDistribution from './StatusDistribution'; 
import ScoreDistribution from './ScoreDistribution'; 

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
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await getAnimeStats(anime.id);
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [anime.id]);

  return (
    <main className="main-content-area">
      <Section title="Characters">
        <CharactersSection animeId={anime.id} />
      </Section>
      <Section title="Staff">
        <StaffSection animeId={anime.id} />
      </Section>
      <Section title="Rankings">
        {loadingStats ? <div>Loading...</div> : <RankingsSection rankings={stats?.rankings} />}
      </Section>
      <div className="distribution-container">
        <Section title="Status Distribution">
          {loadingStats ? <div>Loading...</div> : <StatusDistribution distribution={stats?.status_distribution} />}
        </Section>
        <Section title="Score Distribution">
          {loadingStats ? <div>Loading...</div> : <ScoreDistribution distribution={stats?.score_distribution} />}
        </Section>
      </div>
      <Section title="Trailer">
        <Trailer trailerInfo={anime.trailer} />
      </Section>
    </main>
  );
};

export default MainContentArea;