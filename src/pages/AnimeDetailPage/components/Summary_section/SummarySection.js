// src/pages/components/SummarySection.js
import React, { useState } from 'react';
import EditorModal from './EditorModal';
import { updateUserAnimeStatus } from '../../../../services/api'; // Import hàm API mới
import './SummarySection.css';

const SummarySection = ({ anime, hasBanner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBtnClick = () => {
    // Check Auth Token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này.");
      return;
    }
    setIsModalOpen(true);
  };

  // Hàm xử lý khi nút SAVE trong modal được bấm
  const handleSave = async (apiPayload) => {
    try {
      console.log("Sending data to API:", apiPayload);
      
      // Gọi API: updateUserAnimeStatus(animeId, data)
      await updateUserAnimeStatus(anime.id, apiPayload);
      
      alert("Cập nhật thành công!");
      setIsModalOpen(false); // Đóng modal sau khi thành công
      
      // TODO: Có thể reload lại dữ liệu page để cập nhật UI nếu cần
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khỏi danh sách?")) {
      console.log("Thực hiện xóa...");
      // Gọi API xóa (nếu có)
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className={`summary-section ${!hasBanner ? 'no-banner' : ''}`}>
        <div className="summary-left">
          <img src={anime.cover_image} alt="Cover" className="summary-cover" />
          <button className="btn btn-watching" onClick={handleBtnClick}>
            Watching ▼
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
        onSave={handleSave} 
        onDelete={handleDelete}
      />
    </>
  );
};

export default SummarySection;