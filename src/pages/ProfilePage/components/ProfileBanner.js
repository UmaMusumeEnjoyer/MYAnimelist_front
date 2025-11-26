import React from 'react';
import './ProfileBanner.css';

const ProfileBanner = () => {
  const user = {
    name: "TranQuangDung",
    avatar: "https://s4.anilist.co/file/anilistcdn/user/avatar/large/b588365-C6C5u8S8G8Xp.png",
    banner: "https://s4.anilist.co/file/anilistcdn/user/banner/b588365-d41d8cd98f00b204e9800998ecf8427e.jpg"
  };

  return (
    <div className="banner-container">
      <img src={user.banner} alt="banner" className="banner-img" />
      <div className="user-name">{user.name}</div>
      <div className="user-avatar-container">
        <img src={user.avatar} alt="avatar" className="user-avatar" />
      </div>
      <div className="banner-nav">
        <div className="nav-item active">Overview</div>
        <div className="nav-item">Anime List</div>
        <div className="nav-item">Manga List</div>
        <div className="nav-item">Favorites</div>
        <div className="nav-item">Stats</div>
      </div>
    </div>
  );
};
export default ProfileBanner;