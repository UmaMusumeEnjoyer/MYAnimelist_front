// src/components/CharacterCard.js
import React from 'react';
import './CharacterCard.css';

const CharacterCard = ({ character }) => {
  // Lấy thông tin diễn viên lồng tiếng đầu tiên (thường là tiếng Nhật)
  const voiceActor = character.voice_actors?.[0];

  return (
    <div className="character-card">
      {/* Phần nhân vật */}
      <div className="person-info">
        <img src={character.image} alt={character.name_full} className="person-avatar" />
        <div className="person-details">
          <p className="person-name">{character.name_full}</p>
          <p className="person-role">{character.role}</p>
        </div>
      </div>

      {/* Phần diễn viên lồng tiếng */}
      {voiceActor && (
        <div className="person-info va-info">
          <div className="person-details va-details">
            <p className="person-name">{voiceActor.name_full}</p>
            <p className="person-role">{voiceActor.language}</p>
          </div>
          <img src={voiceActor.image} alt={voiceActor.name_full} className="person-avatar" />
        </div>
      )}
    </div>
  );
};

export default CharacterCard;