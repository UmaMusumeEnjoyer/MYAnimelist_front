// src/components/Header.js
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Header = () => {
  const { isAuthenticated, logout } = useAuth(); // Lấy trạng thái và hàm logout

  return (
    <header className="app-header">
      {/* PHẦN BÊN TRÁI */}
      <div className="header-left">
        <div className="logo">
            <Link to="/">A</Link>
        </div>
      </div>

      {/* PHẦN Ở GIỮA */}
      <nav className="header-center">
        <Link to="/">Home</Link>
        <Link to="/browse">Browse</Link>
        {isAuthenticated && (
          <>
            {/* Khi đã đăng nhập */}
            <Link to="/calendar">Calendar</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/animelist">Anime List</Link>
          </>
        )}
      </nav>

      {/* PHẦN BÊN PHẢI */}
      <div className="header-right">
        {isAuthenticated ? (
          <>
            {/* Khi đã đăng nhập */}
            <div className="user-avatar">AVATAR</div>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            {/* Khi chưa đăng nhập */}
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;