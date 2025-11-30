import React from 'react';
import './ProfileBanner.css';

const ProfileBanner = ({ activeTab, onTabChange }) => {
  const user = {
    name: "TranQuangDung",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s", 
    banner: "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?cs=srgb&dl=pexels-bri-schneiter-28802-346529.jpg&fm=jpg"
  };
  const username = localStorage.getItem("username");

  return (
    <div className="banner-wrapper">
      <div className="banner-image-container">
        <img src={user.banner} alt="banner" className="banner-img" />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="user-info">
            <img src={user.avatar} alt="avatar" className="user-avatar" />
            <span className="user-name">{username}</span>
          </div>
        </div>
      </div>

      <div className="banner-nav">
        <div className="nav-container">
          {/* Overview Tab */}
          <div 
            className={`nav-item ${activeTab === 'Overview' ? 'active' : ''}`}
            onClick={() => onTabChange('Overview')}
          >
            Overview
          </div>

          {/* Anime List Tab */}
          <div 
            className={`nav-item ${activeTab === 'Anime List' ? 'active' : ''}`}
            onClick={() => onTabChange('Anime List')}
          >
            Anime List
          </div>

          {/* Favorites Tab - Kích hoạt logic mới */}
          <div 
            className={`nav-item ${activeTab === 'Favorites' ? 'active' : ''}`}
            onClick={() => onTabChange('Favorites')}
          >
            Favorites
          </div>

          {/* Social Tab */}
          <div 
            className={`nav-item ${activeTab === 'Social' ? 'active' : ''}`}
            onClick={() => onTabChange('Social')}
          >
            Social
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBanner;