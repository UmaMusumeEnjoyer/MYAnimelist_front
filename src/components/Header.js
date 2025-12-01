// src/components/Header.js
import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  // URL ảnh avatar mặc định (bạn có thể thay bằng URL thật từ user data)
  const defaultAvatar = "https://media.gametora.com/umamusume/characters/profile/1114.png";

  return (
    <header className="app-header">
      {/* --- PHẦN BÊN TRÁI --- */}
      <div className="header-left">
        <div className="logo">
            <Link to="/">
                <img 
                  src="/images/Gemini_Generated_Image_eg5d1qeg5d1qeg5d (1).png" 
                  alt="Logo" 
                  className="logo-img"
                /> 
            </Link>
        </div>
      </div>

      {/* --- PHẦN Ở GIỮA --- */}
      <nav className="header-center">
        {isAuthenticated ? (
           <Link to="/homepagelogin">Home</Link>
        ) : (
           <Link to="/">Home</Link>
        )}
        <Link to="/browse">Browse</Link>
        {isAuthenticated && (
          <>
            <Link to="/calendar">Calendar</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/animelist">Anime List</Link>
          </>
        )}
      </nav>

      {/* --- PHẦN BÊN PHẢI (ĐÃ CHỈNH SỬA) --- */}
      <div className="header-right">
        {isAuthenticated ? (
          <>
            {/* Avatar - Click vào sẽ dẫn tới trang Profile */}
            <Link to="/profile" className="user-avatar-link">
               <img 
                 src={defaultAvatar} 
                 alt="User Avatar" 
                 className="user-avatar-img" 
               />
            </Link>
            
            {/* Nút Logout - Style giống nút Login nhưng đổi màu hover */}
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
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