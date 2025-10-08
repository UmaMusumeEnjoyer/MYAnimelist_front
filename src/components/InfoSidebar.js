// src/components/InfoSidebar.js
import React from 'react';
import './InfoSidebar.css';

const InfoBlock = ({ label, value, isAiring = false }) => {
  if (!value) return null;
  return (
    <div className="info-block">
      <h4 className={`info-label ${isAiring ? 'airing-label' : ''}`}>{label}</h4>
      <p className={`info-value ${isAiring ? 'airing-value' : ''}`}>{value}</p>
    </div>
  );
};

const InfoListBlock = ({ label, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="info-block">
      <h4 className="info-label">{label}</h4>
      {items.map((item, index) => (
        <p key={index} className="info-value list-item">{item}</p>
      ))}
    </div>
  );
};

const InfoSidebar = ({ anime }) => {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getAiringValue = () => {
    if (!anime.next_airing_ep) return null;
    const { episode, timeUntilAiring } = anime.next_airing_ep;
    const days = Math.floor(timeUntilAiring / 86400);
    const hours = Math.floor((timeUntilAiring % 86400) / 3600);
    return `Ep ${episode}: ${days}d ${hours}h`;
  };

  return (
    <aside className="info-sidebar">
      <InfoBlock label="Airing" value={getAiringValue()} isAiring={true} />
      <InfoBlock label="Format" value={anime.airing_format} />
      <InfoBlock label="Episodes" value={anime.airing_episodes} />
      <InfoBlock label="Episode Duration" value={`${anime.duration} mins`} />
      <InfoBlock label="Status" value={anime.airing_status?.replace('_', ' ')} />
      <InfoBlock label="Start Date" value={formatDate(anime.starting_time)} />
      <InfoBlock label="End Date" value={formatDate(anime.ending_time)} />
      <InfoBlock label="Season" value={`${anime.season} ${anime.season_year}`} />
      <InfoBlock label="Average Score" value={`${anime.average_score}%`} />
      <InfoBlock label="Mean Score" value={`${anime.mean_score}%`} />
      <InfoBlock label="Popularity" value={anime.popularity?.toLocaleString()} />
      <InfoBlock label="Favorites" value={anime.favourites?.toLocaleString()} />
      <InfoListBlock label="Studios" items={anime.studios} />
      <InfoListBlock label="Producers" items={anime.producers} />
      <InfoBlock label="Source" value={anime.source} />
      <InfoBlock label="Native" value={anime.name_native} />
      <InfoBlock label="English" value={anime.name_english} />
    </aside>
  );
};

export default InfoSidebar;