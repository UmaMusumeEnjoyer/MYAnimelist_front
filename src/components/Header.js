// src/components/Header.js
import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import Modal Search
import GlobalSearchModal from './GlobalSearchModal'; 

// Khai báo Domain Backend để xử lý ảnh
const BACKEND_DOMAIN = 'https://doannguyen.pythonanywhere.com';

const Header = () => {
  // [IMPORTANT] Lấy 'user' trực tiếp từ AuthContext thay vì tự quản lý state
  const { isAuthenticated, logout, user } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Avatar mặc định
  const DEFAULT_AVATAR = "https://media.gametora.com/umamusume/characters/profile/1114.png";

  // Hàm helper xử lý URL ảnh
  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    // Nếu URL bắt đầu bằng http hoặc https (ảnh online), giữ nguyên
    if (url.startsWith('http')) return url;
    // Nếu URL là đường dẫn tương đối từ backend, ghép thêm domain
    return `${BACKEND_DOMAIN}${url}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
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
              {/* <Link to="/calendar">Calendar</Link> */}
              <Link to="/animelist">Anime List</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}
        </nav>

        {/* --- PHẦN BÊN PHẢI --- */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              {/* Nút Search - Mở Modal */}
              <button 
                className="btn-search" 
                aria-label="Search"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              {/* Avatar & Dropdown */}
              <div className="user-menu-container">
                <div className="user-avatar-trigger" onClick={toggleDropdown}>
                   {/* [CORE LOGIC] 
                      Sử dụng user?.avatar_url lấy từ AuthContext.
                      Khi ProfilePage gọi updateUserContext, biến 'user' ở đây thay đổi -> ảnh tự đổi.
                   */}
                   <img 
                      src={getAvatarUrl(user?.avatar_url)} 
                      alt="User Avatar" 
                      className="user-avatar-img" 
                   />
                </div>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/profile" 
                      className="dropdown-item" 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }} 
                      className="dropdown-item btn-dropdown-logout"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
};

export default Header;