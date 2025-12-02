// src/components/GlobalSearchModal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../services/api'; // Sử dụng lại API searchUsers có sẵn
import './GlobalSearchModal.css';

// Debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi API search user giống component cũ
        const res = await searchUsers(debouncedSearchTerm);
        if (res.data && Array.isArray(res.data.results)) {
          setResults(res.data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  // Reset khi đóng
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  const handleUserClick = (username) => {
    // Điều hướng sang trang user
    navigate(`/user/${username}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="gs-overlay" onClick={onClose}>
      <div className="gs-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="gs-header">
          <div className="gs-search-wrapper">
            <span className="material-symbols-outlined" 
                  style={{position: 'absolute', left: '14px', top: '12px', color: '#64748b'}}>
              search
            </span>
            <input 
              className="gs-input"
              placeholder="Search for users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <button className="gs-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined" style={{fontSize: '28px'}}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className="gs-body">
          {loading && <div className="gs-loading">Searching...</div>}

          {!loading && results.length === 0 && searchTerm && (
            <div className="gs-empty">No users found for "{searchTerm}"</div>
          )}
          
          {!loading && results.length === 0 && !searchTerm && (
            <div className="gs-empty">Enter a username to search</div>
          )}

          <div className="gs-results-list">
            {results.map((user) => (
              <div 
                key={user.id || user.username} 
                className="gs-result-item"
                onClick={() => handleUserClick(user.username)}
              >
                <img 
                  src="https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg" 
                  alt={user.username} 
                  className="gs-avatar" 
                />
                <div className="gs-info">
                  <span className="gs-username">{user.username}</span>
                  {/* Nếu API trả về thêm info thì hiện ở đây */}
                </div>
                <span className="material-symbols-outlined" style={{marginLeft: 'auto', color: '#64748b'}}>
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;