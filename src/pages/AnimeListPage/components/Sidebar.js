import React, { useMemo } from 'react';
import './Sidebar.css';

// Component con UserItem giữ nguyên, chỉ nhận props hiển thị
const UserItem = ({ user, roleIcon, iconTitle, onRemove, canRemove }) => {
  // Fallback avatar
  const avatarUrl = user.avatar || "https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg";

  return (
    <div className="sidebar-user-item">
      <div className="user-info">
        <img src={avatarUrl} alt={user.username} className="user-avatar" />
        <div>
          <p className="user-name">{user.username}</p>
          <p className="user-handle">@{user.username}</p> 
        </div>
      </div>
      
      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
        {roleIcon && (
          <span className="material-symbols-outlined role-icon" title={iconTitle}>
            {roleIcon}
          </span>
        )}
        
        {/* Chỉ hiện nút xóa nếu canRemove = true */}
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
  // [UPDATE] Lấy quyền trực tiếp từ LocalStorage
  const permissionLevel = localStorage.getItem("permission_level");
  
  // Xác định xem user hiện tại có phải là Owner không dựa vào localStorage
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
            canRemove={false} // Không bao giờ được xóa Owner
          />
        </div>
      )}

      {/* 2. EDITORS SECTION */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Editors ({editors.length})</h3>
          {/* Chỉ Owner mới thấy nút Add Editor */}
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
                // [LOGIC] canRemove dựa trên biến isCurrentUserOwner lấy từ localStorage
                canRemove={isCurrentUserOwner} 
                onRemove={onRemoveMember}
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
          {/* Chỉ Owner mới thấy nút Add Viewer */}
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
                // [LOGIC] canRemove dựa trên biến isCurrentUserOwner lấy từ localStorage
                canRemove={isCurrentUserOwner}
                onRemove={onRemoveMember}
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