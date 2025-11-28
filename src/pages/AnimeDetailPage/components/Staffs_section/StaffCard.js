// src/components/StaffCard.js
import React from 'react';
import './StaffCard.css';



const StaffCard = ({ staffMember }) => {
  // Kiểm tra xem ảnh có phải là ảnh mặc định hay không
  const hasDefaultImage = staffMember.image?.includes('default.jpg');
  
  return (
    
    <div className="staff-card">
      
      {hasDefaultImage ? (
        <div className="no-image-placeholder">
          <span>NO IMAGE</span>
        </div>
      ) : (
        <img src={staffMember.image} alt={staffMember.name_full} className="staff-avatar" />
      )}
      <div className="staff-details">
        <p className="staff-name">{staffMember.name_full}</p>
        <p className="staff-role">{staffMember.role}</p>
      </div>
     
    </div>
  );
};

export default StaffCard;