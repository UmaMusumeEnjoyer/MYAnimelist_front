// src/components/Header.js
import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal'; 
import { getUserNotifications } from '../services/api';

// [UPDATE] Hàm format thời gian (Ngày + Giờ)
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Sử dụng toLocaleString để hiển thị đầy đủ ngày giờ theo múi giờ người dùng
  return date.toLocaleString('vi-VN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  }); 
};

// [UPDATE] Hàm tính thời gian đếm ngược (Countdown) cho airing_at
const getRelativeTime = (airingAt) => {
    if (!airingAt) return '';
    const now = new Date();
    const airDate = new Date(airingAt);
    const diff = airDate - now;

    // Nếu đã qua giờ chiếu (diff < 0)
    if (diff < 0) return 'Aired'; 

    // Tính toán thời gian còn lại
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
};

const BACKEND_DOMAIN = 'https://doannguyen.pythonanywhere.com';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  const [isNotiModalOpen, setIsNotiModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // ... (Giữ nguyên các hàm getAvatarUrl, toggleDropdown, useEffect...) 
  // Code phần này không thay đổi so với phiên bản trước
  const DEFAULT_AVATAR = "https://media.gametora.com/umamusume/characters/profile/1114.png";
  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    if (isAuthenticated) {
      getUserNotifications({ status: 'sent', limit: 20 })
        .then((res) => {
          if (res.data) {
            setNotificationCount(res.data.count || 0);
            setNotifications(res.data.notifications || []);
          }
        })
        .catch((err) => console.error("Failed to fetch notifications:", err));
    }
  }, [isAuthenticated]);

  const handleOpenNotifications = () => {
    setIsNotiModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className="app-header">
         {/* ... (Phần Header Left, Center, Right giữ nguyên) ... */}
         {/* Copy lại phần JSX của Header từ code cũ, chỉ thay đổi phần Notification Modal bên dưới */}
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
                    <button className="dropdown-item" tabIndex="-1" onClick={handleOpenNotifications}>
                      Notifications 
                      {notificationCount > 0 && <span className="dropdown-badge">{notificationCount}</span>}
                    </button>
                    <button onClick={() => { logout(); setIsDropdownOpen(false); }} tabIndex="-1" className="dropdown-item btn-dropdown-logout">
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
      
      <GlobalSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />

      {/* --- NOTIFICATION MODAL (PHẦN QUAN TRỌNG ĐÃ CẬP NHẬT) --- */}
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3DB4F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                    
                    <div className="noti-info">
                      {/* Dòng 1: Episode + Tên Anime */}
                      <p className="noti-text">
                        <strong>Episode {noti.episode_number}</strong>
                        {/* Kiểm tra null trước khi hiển thị */}
                        <span className="anime-title-highlight"> 
                          {noti.anime_title ? noti.anime_title : `Anime ID: ${noti.anilist_id}`} 
                        </span>
                      </p>
                      
                      {/* Dòng 2: Thời gian Sent + Countdown Airing */}
                      <div className="noti-meta-row">
                        {/* Sent at: Thời gian server gửi thông báo */}
                        <span className="noti-time">
                           Sent: {formatDateTime(noti.sent_at)}
                        </span>

                        {/* Airing at: Thời gian chiếu phim */}
                        <span className={`noti-countdown ${getRelativeTime(noti.airing_at) === 'Aired' ? 'aired' : ''}`}>
                           <svg style={{marginRight: '4px', marginBottom: '-1px'}} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                           {getRelativeTime(noti.airing_at)}
                        </span>
                      </div>
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