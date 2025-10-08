// src/components/Header.js
import React from 'react';
import './Header.css';
// Bạn có thể dùng một icon search từ thư viện như react-icons
// import { FaSearch } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="app-header">
      {/* PHẦN BÊN TRÁI */}
      <div className="header-left">
        <div className="logo">A</div>
      </div>

      {/* PHẦN Ở GIỮA */}
      <nav className="header-center">
        <a href="/">Home</a>
        <a href="/profile">Profile</a>
        <a href="/animelist">Anime List</a>
        <a href="/mangalist">Manga List</a>
        <a href="/browse">Browse</a>
        <a href="/forum">Forum</a>
      </nav>

      {/* PHẦN BÊN PHẢI */}
      <div className="header-right">
        <div className="search-icon">
          {/* <FaSearch /> */}
          🔍 {/* Placeholder icon */}
        </div>
        <div className="user-profile">
          <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTOUnRMlghcHl_x1mjnLO4XV1nL6b3dZQR9KUgLUfTB_0Te-Ls7DZiH6Z4AGPsQErq81Ss8Zu2fh5XV_RURJf7MRtkKl-faC3Ae2yoTaAU" alt="User Avatar" />
          <span className="notification-badge">22</span>
        </div>
      </div>
    </header>
  );
};

export default Header;