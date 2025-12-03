// src/pages/AnimeListPage/components/UserSearchModal.js
import React, { useState, useEffect } from 'react';
// [UPDATE 1] Import getUserProfile
import { searchUsers, addMemberToList, updateMemberPermission, getUserProfile } from '../../../services/api'; 
import './UserSearchModal.css';

// Khai báo Domain Backend
const BACKEND_DOMAIN = 'https://doannguyen.pythonanywhere.com';

// Hook debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// [UPDATE 2] Component con để xử lý từng kết quả tìm kiếm & lấy Avatar
const UserSearchResultItem = ({ user, currentMembers, isEditorMode, isProcessing, onAddUser }) => {
  const DEFAULT_AVATAR = "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";
  const [displayAvatar, setDisplayAvatar] = useState(DEFAULT_AVATAR);

  // Helper xử lý URL
  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
  };

  // [LOGIC FETCH AVATAR]
  useEffect(() => {
    let isMounted = true;

    // Ưu tiên avatar có sẵn từ kết quả search trước (tránh layout shift)
    if (user.avatar || user.avatar_url) {
      setDisplayAvatar(getAvatarUrl(user.avatar || user.avatar_url));
    }

    // Gọi API lấy thông tin profile chi tiết
    if (user.username) {
      getUserProfile(user.username)
        .then((res) => {
          if (isMounted && res.data && res.data.avatar_url) {
            setDisplayAvatar(getAvatarUrl(res.data.avatar_url));
          }
        })
        .catch((err) => console.error(err));
    }
    return () => { isMounted = false; };
  }, [user.username, user.avatar, user.avatar_url]);

  // [LOGIC TÍNH TOÁN NÚT BẤM]
  const existingMember = currentMembers.find(m => m.username === user.username);
  const isOwner = existingMember?.is_owner;

  let btnText = "Invite";
  let btnIcon = "person_add";
  let isDisabled = isProcessing || isOwner; 
  let btnClass = isEditorMode ? 'editor' : 'viewer'; 

  if (existingMember) {
    if (isEditorMode) {
        // Mode Add Editor
        if (existingMember.can_edit) {
          btnText = "Joined";
          btnIcon = "check";
          isDisabled = true;
        } else {
          btnText = "Promote";
          btnIcon = "arrow_upward";
        }
    } else {
        // Mode Add Viewer
        if (existingMember.can_edit) {
          btnText = "Demote";
          btnIcon = "arrow_downward";
        } else {
          btnText = "Joined";
          btnIcon = "check";
          isDisabled = true;
        }
    }
  }

  return (
    <div className="user-card-item">
      <div className="user-card-info">
        {/* Hiển thị avatar đã fetch */}
        <img src={displayAvatar} alt={user.username} className="user-card-avatar" />
        <div>
          <p className="user-card-name">
            {user.username}
            {user.email_verified && (
              <span className="material-symbols-outlined" 
                style={{fontSize: '14px', color: '#3db4f2', marginLeft: '4px', verticalAlign: 'middle'}}
                title="Verified Email">
                verified
              </span>
            )}
          </p>
          
          <p className="user-card-handle">
            {existingMember ? (
                <span style={{color: '#94a3b8', fontStyle: 'italic'}}>
                  Currently: {isOwner ? 'Owner' : (existingMember.can_edit ? 'Editor' : 'Viewer')}
                </span>
            ) : (
                <>Assign: <span style={{color: isEditorMode ? '#e85d75' : '#3db4f2', fontWeight: 'bold'}}>
                  {isEditorMode ? 'Editor' : 'Viewer'}
                </span></>
            )}
          </p>
        </div>
      </div>

      <button 
        className={`btn-invite ${btnClass}`} 
        onClick={() => onAddUser(user)}
        disabled={isDisabled}
        title={isOwner ? "Cannot modify Owner" : ""}
      >
        {isProcessing ? (
          <span className="material-symbols-outlined spin-icon" style={{fontSize: '18px'}}>sync</span>
        ) : (
          <>
            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>{btnIcon}</span>
            {btnText}
          </>
        )}
      </button>
    </div>
  );
};

// [MAIN COMPONENT]
const UserSearchModal = ({ isOpen, onClose, listId, roleType, onUserAdded, currentMembers = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState([]); 

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isEditorMode = roleType === 'editor'; 

  // 1. SEARCH & FILTER LOGIC
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      const suggestedUsers = currentMembers.filter(member => {
        if (member.is_owner) return false;
        if (isEditorMode) {
          return !member.can_edit;
        } else {
          return member.can_edit;
        }
      });
      setResults(suggestedUsers);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await searchUsers(debouncedSearchTerm);
        if (res.data && Array.isArray(res.data.results)) {
          setResults(res.data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search API failed:", error); 
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchTerm, currentMembers, isEditorMode]);

  const handleClose = () => {
    setSearchTerm('');
    setResults([]);
    onClose();
  };

  // 2. ACTION HANDLER
  const handleAddUser = async (user) => {
    setProcessingIds(prev => [...prev, user.username]);
    
    const existingMember = currentMembers.find(m => m.username === user.username);
    
    if (existingMember && existingMember.is_owner) {
      alert("Cannot change permissions of the List Owner.");
      setProcessingIds(prev => prev.filter(id => id !== user.username));
      return;
    }

    try {
      if (isEditorMode) {
        if (existingMember) {
          await updateMemberPermission(listId, {
            username: user.username,
            can_edit: true
          });
        } else {
          await addMemberToList(listId, {
            username: user.username,
            can_edit: true
          });
        }
      } else {
        if (existingMember) {
          if (existingMember.can_edit) {
            await updateMemberPermission(listId, {
              username: user.username,
              can_edit: false
            });
          } else {
            alert(`${user.username} is already a viewer.`);
            setProcessingIds(prev => prev.filter(id => id !== user.username));
            return; 
          }
        } else {
          await addMemberToList(listId, {
            username: user.username,
            permission_level: 'view'
          });
        }
      }

      if (onUserAdded) onUserAdded(); 
      
    } catch (error) {
      console.error(error);
      alert(`Failed to process action for ${user.username}.`);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== user.username));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={handleClose}>
      <div className="user-modal-content" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="user-modal-header">
          <div className="modal-search-wrapper">
            <span className="material-symbols-outlined search-icon" 
                  style={{position: 'absolute', left: '12px', color: '#64748b'}}>
              search
            </span>
            <input 
              className="user-search-input"
              placeholder={`Search user to add as ${roleType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* BODY */}
        <div className="user-modal-body">
          {loading && <div className="modal-loading">Searching users...</div>}

          {!loading && results.length === 0 && !searchTerm && (
            <div className="modal-helper-text">
              Type a username to invite them as a 
              <strong style={{color: isEditorMode ? '#e85d75' : '#3db4f2'}}> {roleType}</strong>.
            </div>
          )}
          
          {!loading && results.length === 0 && searchTerm && (
            <div className="modal-helper-text">No users found.</div>
          )}

          <div className="user-grid">
            {results.map((user) => (
              // [UPDATE 3] Sử dụng component con thay vì render trực tiếp
              <UserSearchResultItem 
                key={user.id || user.username}
                user={user}
                currentMembers={currentMembers}
                isEditorMode={isEditorMode}
                isProcessing={processingIds.includes(user.username)}
                onAddUser={handleAddUser}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;