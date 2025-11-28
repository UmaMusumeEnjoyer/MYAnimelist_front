// src/components/StaffSection.js
import React, { useState, useEffect } from 'react';
import { getAnimeStaff } from '../../../../services/api';
import StaffCard from './StaffCard';
import './StaffSection.css';

const StaffSection = ({ animeId }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!animeId) return;
      try {
        setLoading(true);
        const response = await getAnimeStaff(animeId);
        // Lấy tối đa 3 staff đầu tiên
        setStaff(response.data.staff.slice(0, 3));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [animeId]);

  if (loading) {
    return <div>Loading staff...</div>;
  }

  if (staff.length === 0) {
    return <p>No staff information available.</p>;
  }

  return (
    <div className="staff-grid">
      {staff.map(member => (
        <StaffCard key={member.id} staffMember={member} />
      ))}
    </div>
  );
};

export default StaffSection;