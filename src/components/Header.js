// src/components/Header.js
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Đừng quên import ảnh logo của bạn vào đây
// Ví dụ: import logoImg from '../assets/logo.png'; 
// Hoặc dùng đường dẫn chuỗi nếu ảnh để trong thư mục public

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="app-header">
      {/* PHẦN BÊN TRÁI */}
      <div className="header-left">
        <div className="logo">
            <Link to="/">
                {/* Thay thế chữ 'A' bằng thẻ img */}
                {/* Cách 1: Nếu import ảnh: src={logoImg} */}
                {/* Cách 2: Nếu ảnh trong folder public: src="/logo.png" */}
                <img 
                  src="/unnamed__1_-removebg-preview.png" 
                  alt="Logo" 
                  className="logo-img"
                /> 
            </Link>
        </div>
      </div>

      {/* PHẦN Ở GIỮA - GIỮ NGUYÊN */}
      <nav className="header-center">
        {isAuthenticated && (
          <Link to="/homepagelogin">Home</Link>
        )}
        {!isAuthenticated && <Link to="/">Home</Link>} 
        <Link to="/browse">Browse</Link>
        {isAuthenticated && (
          <>
            <Link to="/calendar">Calendar</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/animelist">Anime List</Link>
            <Link to="/list">List</Link>
          </>
        )}
      </nav>

      {/* PHẦN BÊN PHẢI - GIỮ NGUYÊN */}
      <div className="header-right">
        {isAuthenticated ? (
          <>
            <div className="user-avatar">AVATAR</div>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;