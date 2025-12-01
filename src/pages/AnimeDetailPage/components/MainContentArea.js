// src/components/MainContentArea.js
import React, { useState, useEffect } from 'react';
import './MainContentArea.css';
import { getAnimeStats, getAnimeCharacters, getAnimeStaff } from '../../../services/api';
import CharactersSection from './Characters_section/CharactersSection';
import StaffSection from './Staffs_section/StaffSection';
import RankingsSection from './Ranking_section/RankingsSection';
import StatusDistribution from './Statistics_section/StatusDistribution'; 
import ScoreDistribution from './Statistics_section/ScoreDistribution'; 

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
  const [characters, setCharacters] = useState([]);
  const [staff, setStaff] = useState([]);
  const [charactersPageInfo, setCharactersPageInfo] = useState(null);
  const [staffPageInfo, setStaffPageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi SONG SONG 3 API cùng lúc với Promise.all
        const [statsRes, charactersRes, staffRes] = await Promise.all([
          getAnimeStats(anime.id),
          getAnimeCharacters(anime.id, { page: 1, perpage: 10 }),
          getAnimeStaff(anime.id, { page: 1, perpage: 10 })
        ]);
        
        // Set data từ các response
        setStats(statsRes.data);
        setCharacters(charactersRes.data.characters || []);
        setCharactersPageInfo(charactersRes.data.pageInfo || null);
        setStaff(staffRes.data.staff || []);
        setStaffPageInfo(staffRes.data.pageInfo || null);
        
      } catch (error) {
        console.error("Error fetching anime data:", error);
        setError("Failed to load anime data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (anime?.id) {
      fetchAllData();
    }
  }, [anime.id]);

  // Loading state
  if (loading) {
    return (
      <main className="main-content-area">
        <div className="loading-container">
          <p>Loading anime details...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="main-content-area">
        <div className="error-container">
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content-area">
      <Section title="Characters">
        <CharactersSection 
          animeId={anime.id}
          initialCharacters={characters}
          initialPageInfo={charactersPageInfo}
        />
      </Section>
      
      <Section title="Staff">
        <StaffSection 
          animeId={anime.id}
          initialStaff={staff}
          initialPageInfo={staffPageInfo}
        />
      </Section>
      
      <Section title="Rankings">
        <RankingsSection rankings={stats?.rankings} />
      </Section>
      
      <div className="distribution-container">
        <Section title="Status Distribution">
          <StatusDistribution distribution={stats?.status_distribution} />
        </Section>
        <Section title="Score Distribution">
          <ScoreDistribution distribution={stats?.score_distribution} />
        </Section>
      </div>
      
      <Section title="Trailer">
        <Trailer trailerInfo={anime.trailer} />
      </Section>
    </main>
  );
};

export default MainContentArea;