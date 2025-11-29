// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

const UserItem = ({ user, roleIcon, iconTitle }) => (
  <div className="sidebar-user-item">
    <div className="user-info">
      <img src={user.avatar} alt={user.name} className="user-avatar" />
      <div>
        <p className="user-name">{user.name}</p>
        <p className="user-handle">{user.handle}</p>
      </div>
    </div>
    {roleIcon && (
      <span className="material-symbols-outlined role-icon" title={iconTitle}>
        {roleIcon}
      </span>
    )}
  </div>
);

const Sidebar = ({ data }) => {
  return (
    <aside className="sidebar">
      {/* Owner Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Owner</h3>
        <UserItem user={data.owner} />
      </div>

      {/* Editors Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Editors</h3>
          <button className="add-btn"><span className="material-symbols-outlined">add</span></button>
        </div>
        <div className="user-list">
          {data.editors.map((editor, index) => (
            <UserItem key={index} user={editor} roleIcon="edit" iconTitle="Can edit" />
          ))}
        </div>
      </div>

      {/* Viewers Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">
          <h3 className="sidebar-title">Viewers</h3>
          <button className="add-btn"><span className="material-symbols-outlined">add</span></button>
        </div>
        <div className="user-list">
          {data.viewers.map((viewer, index) => (
            <UserItem key={index} user={viewer} roleIcon="visibility" iconTitle="Can view" />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;