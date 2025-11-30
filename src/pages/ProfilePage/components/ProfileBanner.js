import React from 'react';
import './ProfileBanner.css';

const ProfileBanner = () => {
  const user = {
    name: "TranQuangDung",
    avatar: "https://gametora.com/images/umamusume/supports/tex_support_card_30248.png",
    banner: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEZmorQbm1gSVgk4ITRR_ti26w3CfxsYefZw&s"
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
        <div className="nav-item">Favorites</div>
      </div>
    </div>
  );
};
export default ProfileBanner;