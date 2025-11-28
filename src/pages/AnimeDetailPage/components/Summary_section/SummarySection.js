// src/pages/components/SummarySection.js
import React, { useState, useEffect } from 'react';
import EditorModal from './EditorModal'; 
import { updateUserAnimeStatus, getUserAnimeStatus } from '../../../../services/api'; 
import './SummarySection.css';

const SummarySection = ({ anime, hasBanner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatusData, setCurrentStatusData] = useState(null); 
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  const statusMap = {
    'watching': 'Watching',
    'plan_to_watch': 'Plan to Watch',
    'completed': 'Completed',
    'dropped': 'Dropped',
    'on_hold': 'On Hold'
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !anime?.id) return;

      setIsLoadingStatus(true);
      try {
        const response = await getUserAnimeStatus(anime.id);
        if (response && response.data) {
          // Lưu toàn bộ data trả về (bao gồm cả trường hợp is_following: false)
          setCurrentStatusData(response.data);
        }
      } catch (error) {
        // Trường hợp lỗi mạng hoặc 404 thực sự
        setCurrentStatusData(null);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchUserStatus();
  }, [anime]);

  const handleBtnClick = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSave = async (apiPayload, isUpdateMode = false) => {
    try {
      if (isUpdateMode) {
        // UPDATE
        setCurrentStatusData(prev => ({
          ...prev,
          ...apiPayload
        }));
      } else {
        // CREATE
        const response = await updateUserAnimeStatus(anime.id, apiPayload);
        
        // Cập nhật state UI: Quan trọng là set is_following = true
        setCurrentStatusData({
            ...apiPayload,
            anime: anime.id,
            is_following: true // Đánh dấu đã follow để đổi nút hiển thị
        });
        alert("Thêm vào danh sách thành công!");
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = () => {
    // Reset về null hoặc giữ data nhưng set is_following = false
    setCurrentStatusData(null); 
    setIsModalOpen(false);
  };

  // --- LOGIC MỚI: Kiểm tra is_following ---
  // Người dùng đã follow nếu có data VÀ is_following === true
  const isFollowing = currentStatusData && currentStatusData.is_following;

  const buttonLabel = isLoadingStatus 
    ? 'Loading...' 
    : (isFollowing ? (statusMap[currentStatusData.watch_status] || 'Unknown') : 'Add to List');

  const buttonClass =  'btn-watching'; // Bạn có thể tách class css nếu muốn 'btn-add' khác màu

  return (
    <>
      <div className={`summary-section ${!hasBanner ? 'no-banner' : ''}`}>
        <div className="summary-left">
          <img src={anime.cover_image} alt="Cover" className="summary-cover" />
          
          <button className={`btn ${buttonClass}`} onClick={handleBtnClick}>
            {buttonLabel} 
          </button>

        </div>
        <div className="summary-right">
          <h1 className="anime-title-main">{anime.name_romaji}</h1>
          <div 
            className="anime-description" 
            dangerouslySetInnerHTML={{ __html: anime.desc }}
          ></div>
        </div>
      </div>

      <EditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        anime={anime}
        initialData={currentStatusData}
        onSave={handleSave} 
        onDelete={handleDelete}
      />
    </>
  );
};

export default SummarySection;