// src/components/Header.js
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom'; // Import Link

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
        <a href="/calendar">Calendar</a>
        <a href="/browse">Browse</a>
       
      </nav>

      {/* PHẦN BÊN PHẢI */}
      <div className="header-right">
        <Link to="/login" className="btn-login">Login</Link>
        <Link to="/signup" className="btn-signup">Sign Up</Link>
      </div>
    </header>
  );
};

export default Header;