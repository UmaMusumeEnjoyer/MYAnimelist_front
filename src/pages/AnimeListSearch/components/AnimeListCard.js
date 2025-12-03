import React from 'react';
import { FaHeart, FaLayerGroup } from 'react-icons/fa';
import '../AnimeListSearchPage.css';

const AnimeListCard = ({ listData }) => {
  // listData giả định: { title, user, likes, count, coverImages: [] }
  
  return (
    <div className="anime-list-card">
      {/* Khu vực ảnh preview (Hiển thị 3 ảnh cover anime trong list) */}
      <div className="alc-preview">
        {listData.coverImages.slice(0, 3).map((img, index) => (
          <div 
            key={index} 
            className="alc-cover" 
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        {/* Lớp phủ hiển thị số lượng */}
        <div className="alc-overlay">
            <span className="alc-count">
                <FaLayerGroup /> {listData.count} items
            </span>
        </div>
      </div>

      {/* Thông tin List */}
      <div className="alc-info">
        <h3 className="alc-title">{listData.title}</h3>
        
        <div className="alc-meta">
          <div className="alc-user">
            <img src={listData.userAvatar} alt="user" className="alc-avatar"/>
            <span>{listData.username}</span>
          </div>
          
          <div className="alc-likes">
            <FaHeart className="heart-icon"/> {listData.likes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeListCard;