// src/components/Header.js
import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import Modal mới
import GlobalSearchModal from './GlobalSearchModal'; 

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // State điều khiển Search Modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const defaultAvatar = "https://media.gametora.com/umamusume/characters/profile/1114.png";

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
              <Link to="/calendar">Calendar</Link>
              <Link to="/animelist">Anime List</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}
        </nav>

        {/* --- PHẦN BÊN PHẢI --- */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              {/* Nút Search - Sửa sự kiện onClick để mở Modal */}
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
                   <img src={defaultAvatar} alt="User Avatar" className="user-avatar-img" />
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

      {/* Render Modal ở đây */}
      <GlobalSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
};

export default Header;