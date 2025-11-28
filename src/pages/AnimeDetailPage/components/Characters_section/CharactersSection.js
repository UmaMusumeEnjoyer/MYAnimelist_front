// src/components/CharactersSection.js
import React, { useState, useEffect } from 'react';
import { getAnimeCharacters } from '../../../../services/api';
import CharacterCard from './CharacterCard';
import './CharactersSection.css';

const CharactersSection = ({ animeId }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!animeId) return;
      try {
        setLoading(true);
        const response = await getAnimeCharacters(animeId);
        // Lấy tối đa 6 nhân vật đầu tiên
        setCharacters(response.data.characters.slice(0, 6));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhân vật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [animeId]);

  if (loading) {
    return <div>Loading characters...</div>;
  }

  if (characters.length === 0) {
    return <p>No character information available.</p>;
  }

  return (
    <div className="characters-grid">
      {characters.map(char => (
        <CharacterCard key={char.id} character={char} />
      ))}
    </div>
  );
};

export default CharactersSection;