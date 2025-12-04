// src/components/Header.js
import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal'; 
import { getUserNotifications } from '../services/api';

// Hàm format thời gian đơn giản
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const BACKEND_DOMAIN = 'https://doannguyen.pythonanywhere.com';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  // [STATE MỚI] Quản lý Modal thông báo và danh sách thông báo
  const [isNotiModalOpen, setIsNotiModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const DEFAULT_AVATAR = "https://media.gametora.com/umamusume/characters/profile/1114.png";

  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Effect load thông báo
  useEffect(() => {
    if (isAuthenticated) {
      getUserNotifications({ status: 'sent', limit: 20 })
        .then((res) => {
          if (res.data) {
            // [UPDATE] Lưu cả số lượng và danh sách thông báo
            setNotificationCount(res.data.count || 0);
            setNotifications(res.data.notifications || []);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch notifications:", err);
        });
    }
  }, [isAuthenticated]);

  // Hàm mở Modal thông báo và đóng dropdown
  const handleOpenNotifications = () => {
    setIsNotiModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="app-header">
        {/* ... (Phần Header Left và Center giữ nguyên) ... */}
        <div className="header-left">
          <div className="logo">
              <Link to="/" tabIndex="-1">
                  <img src="/images/Gemini_Generated_Image_eg5d1qeg5d1qeg5d (1).png" alt="Logo" className="logo-img" /> 
              </Link>
          </div>
        </div>

        <nav className="header-center">
          {isAuthenticated ? <Link to="/homepagelogin" tabIndex="-1">Home</Link> : <Link to="/" tabIndex="-1">Home</Link>}
          <Link to="/browse" tabIndex="-1">Browse</Link>
          {isAuthenticated && (
            <>
              <Link to="/animelist" tabIndex="-1">Anime List</Link>
              <Link to="/profile" tabIndex="-1">Profile</Link>
            </>
          )}
        </nav>

        {/* --- PHẦN BÊN PHẢI --- */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              <button className="btn-search" aria-label="Search" tabIndex="-1" onClick={() => setIsSearchModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </button>

              <div className="user-menu-container">
                <div className="user-avatar-trigger" onClick={toggleDropdown}>
                   <img src={getAvatarUrl(user?.avatar_url)} alt="User Avatar" className="user-avatar-img" />
                   {notificationCount > 0 && (
                     <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
                   )}
                </div>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item" tabIndex="-1" onClick={() => setIsDropdownOpen(false)}>
                      Profile
                    </Link>
                    
                    {/* [NEW] Nút mở danh sách thông báo */}
                    <button 
                      className="dropdown-item"
                      tabIndex="-1"
                      onClick={handleOpenNotifications}
                    >
                      Notifications 
                      {notificationCount > 0 && <span className="dropdown-badge">{notificationCount}</span>}
                    </button>

                    <button 
                      onClick={() => { logout(); setIsDropdownOpen(false); }} 
                      tabIndex="-1" 
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
              <Link to="/login" className="btn-login" tabIndex="-1">Login</Link>
              <Link to="/signup" className="btn-signup" tabIndex="-1">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

      {/* [NEW] Notification Modal */}
      {isNotiModalOpen && (
        <div className="noti-modal-overlay" onClick={() => setIsNotiModalOpen(false)}>
          <div className="noti-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="noti-header">
              <h3>Notifications</h3>
              <button className="btn-close-noti" onClick={() => setIsNotiModalOpen(false)}>&times;</button>
            </div>
            <div className="noti-list">
              {notifications.length > 0 ? (
                notifications.map((noti) => (
                  <div key={noti.notification_id} className="noti-item">
                    <div className="noti-icon">
                      {/* Icon chuông hoặc hình ảnh anime nếu có */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3DB4F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                    <div className="noti-info">
                      <p className="noti-text">
                        <strong>New Episode!</strong> Episode {noti.episode_number} of Anime (ID: {noti.anilist_id}) is now airing.
                      </p>
                      <span className="noti-time">{formatDate(noti.airing_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="noti-empty">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;