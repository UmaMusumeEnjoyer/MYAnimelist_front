import React from 'react';
import './ListHeader.css';

const ListHeader = ({ listInfo }) => {
  return (
    <div className="page-header">
      <div className="header-text">
        <h1 className="page-title">{listInfo.list_name}</h1>
        {listInfo.description && (
          <p className="page-description">
            {listInfo.description}
          </p>
        )}
        {listInfo.is_private && (
          <div className="private-badge-wrapper">
            <span className="count-badge private-badge">
              Private
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListHeader;