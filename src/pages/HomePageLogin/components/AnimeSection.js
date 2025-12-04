// src/components/AnimeSection.js
import React, { useState, useEffect } from 'react';
import AnimeCard from '../../../components/AnimeCard';
import './AnimeSection.css';
// Import API functions
import { getNotificationPreferences, updateNotificationPreferences } from '../../../services/api';

const AnimeSection = ({ title, animeList, allowNotification }) => {
  // 1. KHAI BÁO TẤT CẢ HOOKS Ở ĐẦU (Luôn luôn)
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  const [settings, setSettings] = useState({
    notify_before_hours: 24,
    enabled: true,
    notify_by_email: true,
    notify_in_app: true
  });

  // 2. USEEFFECT PHẢI ĐẶT TRƯỚC CÁC CÂU LỆNH RETURN
  // 2. USEEFFECT: Gọi API khi mở Modal
  useEffect(() => {
    if (showModal && allowNotification) {
      const fetchSettings = async () => {
        setIsLoadingSettings(true);
        try {
          const response = await getNotificationPreferences();
          
          // QUAN TRỌNG: Dữ liệu nằm trong response.data
          // Dựa trên log của bạn: response.data = { notify_before_hours: 24, ... }
          const serverData = response.data;

          if (serverData) {
            setSettings({
              notify_before_hours: serverData.notify_before_hours,
              enabled: serverData.enabled,
              notify_by_email: serverData.notify_by_email,
              notify_in_app: serverData.notify_in_app
            });
          }
        } catch (error) {
          console.error("Failed to fetch notification settings:", error);
        } finally {
          setIsLoadingSettings(false);
        }
      };
      fetchSettings();
    }
  }, [showModal, allowNotification]);

  // 3. CÁC HÀM HANDLER
  const handleNotifyClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const payload = {
      notify_before_hours: parseInt(settings.notify_before_hours, 10),
      enabled: settings.enabled,
      notify_by_email: settings.notify_by_email,
      notify_in_app: settings.notify_in_app
    };

    try {
      await updateNotificationPreferences(payload);
      console.log("Settings saved successfully:", payload);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  // 4. KIỂM TRA ĐIỀU KIỆN RETURN SỚM (Đặt sau tất cả Hooks)
  if (!animeList || animeList.length === 0) {
    return null;
  }

  // 5. TÍNH TOÁN BIẾN HIỂN THỊ
  const displayedAnime = isExpanded ? animeList : animeList.slice(0, 6);
  const showViewAllButton = animeList.length > 6;

  // 6. RETURN JSX
  return (
    <section className="anime-section">
      <div className="section-header">
        <h2 className="section-title">
          {title} <span className="count-badge">{animeList.length}</span>
        </h2>
        
        <div className="header-controls">
          {allowNotification && (
            <button 
              className="notify-btn" 
              onClick={handleNotifyClick}
              title="Notification Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="btn-text">Notify</span>
            </button>
          )}

          {showViewAllButton && (
            <button 
              className="view-all-btn" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>
      </div>

      <div className="anime-grid">
        {displayedAnime.map(anime => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Notification Settings</h3>
              <button className="close-btn" onClick={handleCloseModal}>&times;</button>
            </div>
            
            {isLoadingSettings ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#a0aec0' }}>
                Loading settings...
              </div>
            ) : (
              <form onSubmit={handleSaveSettings} className="modal-body">
                <div className="form-group-checkbox master-switch">
                  <label>
                    <input 
                      type="checkbox" 
                      name="enabled"
                      checked={settings.enabled}
                      onChange={handleSettingChange}
                    />
                    Enable Notifications
                  </label>
                </div>

                <div className={`settings-group ${!settings.enabled ? 'disabled' : ''}`}>
                  <div className="form-group">
                    <label>Notify Before (Hours):</label>
                    <input 
                      type="number" 
                      name="notify_before_hours"
                      value={settings.notify_before_hours}
                      onChange={handleSettingChange}
                      min="1"
                      disabled={!settings.enabled}
                    />
                  </div>

                  <div className="form-group-checkbox">
                    <label>
                      <input 
                        type="checkbox" 
                        name="notify_by_email"
                        checked={settings.notify_by_email}
                        onChange={handleSettingChange}
                        disabled={!settings.enabled}
                      />
                      Send via Email
                    </label>
                  </div>

                  <div className="form-group-checkbox">
                    <label>
                      <input 
                        type="checkbox" 
                        name="notify_in_app"
                        checked={settings.notify_in_app}
                        onChange={handleSettingChange}
                        disabled={!settings.enabled}
                      />
                      Send In-App Notification
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="save-btn">Save Changes</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AnimeSection;