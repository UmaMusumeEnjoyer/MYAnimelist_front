// src/pages/AnimeListPage/components/Sidebar.js
import React, { useMemo, useState, useEffect } from 'react';
import './Sidebar.css';
// [UPDATE 1] Import API getUserProfile
import { getUserProfile } from '../../../services/api'; 

// Khai báo Domain Backend để xử lý ảnh
const BACKEND_DOMAIN = 'https://doannguyen.pythonanywhere.com';

const UserItem = ({ user, roleIcon, iconTitle, onRemove, canRemove, isCurrentUser }) => {
  // Avatar mặc định
  const DEFAULT_AVATAR = "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";

  // [UPDATE 2] State để lưu avatar hiển thị
  const [displayAvatar, setDisplayAvatar] = useState(DEFAULT_AVATAR);

  // Hàm xử lý URL ảnh
  const getAvatarUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http')) return url;
    return `${BACKEND_DOMAIN}${url}`;
  };

  // [UPDATE 3] useEffect để gọi API lấy thông tin profile mới nhất (bao gồm Avatar)
  useEffect(() => {
    let isMounted = true;

    // Ưu tiên hiển thị avatar có sẵn trong props trước (nếu có) để tránh layout shift
    if (user.avatar || user.avatar_url) {
      setDisplayAvatar(getAvatarUrl(user.avatar || user.avatar_url));
    }

    // Gọi API lấy thông tin chi tiết
    if (user.username) {
      getUserProfile(user.username)
        .then((res) => {
          if (isMounted && res.data && res.data.avatar_url) {
            // Cập nhật lại avatar từ API getUserProfile
            setDisplayAvatar(getAvatarUrl(res.data.avatar_url));
          }
        })
        .catch((err) => {
          console.error(`Failed to fetch profile for ${user.username}`, err);
        });
    }

    return () => { isMounted = false; };
  }, [user.username, user.avatar, user.avatar_url]);

  return (
    <div className={`sidebar-user-item ${isCurrentUser ? 'current-user' : ''}`}>
      <div className="user-info">
        {/* [UPDATE 4] Sử dụng state displayAvatar */}
        <img src={displayAvatar} alt={user.username} className="user-avatar" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <p className="user-name">{user.username}</p>
            {isCurrentUser && <span className="you-badge">You</span>}
          </div>
          <p className="user-handle">@{user.username}</p> 
        </div>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        {roleIcon && (
          <span className="material-symbols-outlined role-icon" title={iconTitle}>
            {roleIcon}
          </span>
        )}
        
        {canRemove && (
          <button 
            className="remove-member-btn"
            onClick={() => onRemove(user.username)}
            title="Remove member"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ members = [], onAddEditor, onAddViewer, onRemoveMember }) => {
  const permissionLevel = localStorage.getItem("permission_level");
  const currentUsername = localStorage.getItem("username");
  
  const isCurrentUserOwner = permissionLevel === "owner";

  const { owner, editors, viewers } = useMemo(() => {
    let owner = null;
    const editors = [];
    const viewers = [];

    members.forEach((member) => {
      if (member.is_owner) {
        owner = member;
      } else if (member.permission_level === 'edit' || member.can_edit) {
        editors.push(member);
      } else {
        viewers.push(member);
      }
    });

    return { owner, editors, viewers };
  }, [members]);

  if (!members.length) {
    return (
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Members</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Loading members...
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      {/* 1. OWNER SECTION */}
      {owner && (
        <div className="sidebar-section">
          <h3 className="sidebar-title">Owner</h3>
          <UserItem 
            user={owner} 
            roleIcon="verified_user" 
            iconTitle="List Owner" 
            canRemove={false}
            isCurrentUser={owner.username === currentUsername}
          />
        </div>
      )}

      {/* 2. EDITORS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Editors ({editors.length})</h3>
          {isCurrentUserOwner && (
            <button className="add-btn" onClick={onAddEditor} title="Invite new Editor">
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
        <div className="user-list">
          {editors.length > 0 ? (
            editors.map((editor) => (
              <UserItem 
                key={editor.user_id || editor.username} 
                user={editor} 
                roleIcon="edit" 
                iconTitle="Can edit content"
                canRemove={isCurrentUserOwner} 
                onRemove={onRemoveMember}
                isCurrentUser={editor.username === currentUsername}
              />
            ))
          ) : (
            <p className="empty-text">No editors yet.</p>
          )}
        </div>
      </div>

      {/* 3. VIEWERS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Viewers ({viewers.length})</h3>
          {isCurrentUserOwner && (
            <button className="add-btn" onClick={onAddViewer} title="Invite new Viewer">
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
        <div className="user-list">
          {viewers.length > 0 ? (
            viewers.map((viewer) => (
              <UserItem 
                key={viewer.user_id || viewer.username} 
                user={viewer} 
                roleIcon="visibility" 
                iconTitle="Can view only"
                canRemove={isCurrentUserOwner}
                onRemove={onRemoveMember}
                isCurrentUser={viewer.username === currentUsername}
              />
            ))
          ) : (
            <p className="empty-text">No viewers yet.</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;