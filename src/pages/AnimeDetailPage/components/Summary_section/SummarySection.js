// src/pages/components/SummarySection.js
import React, { useState } from 'react';
import EditorModal from './EditorModal';
import { updateUserAnimeStatus, getUserAnimeStatus } from '../../../../services/api'; // Import thêm getUserAnimeStatus
import './SummarySection.css';

const SummarySection = ({ anime, hasBanner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatusData, setCurrentStatusData] = useState(null); // State lưu dữ liệu lấy từ API

  const handleBtnClick = async () => {
    // 1. Check Auth Token
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này.");
      return;
    }

    // 2. Gọi API lấy trạng thái trước khi mở Modal
    try {
      const response = await getUserAnimeStatus(anime.id);
      if (response && response.data) {
        console.log("Đã tìm thấy dữ liệu tracking:", response.data);
        setCurrentStatusData(response.data); // Lưu dữ liệu vào state để truyền cho Modal
      }
    } catch (error) {
      // 3. Nếu không có kết quả hoặc lỗi (404), không báo lỗi, coi như chưa theo dõi
      console.log("Chưa có dữ liệu tracking hoặc lỗi:", error);
      setCurrentStatusData(null); // Reset về null để Modal hiển thị form trống
    }

    // 4. Mở Modal
    setIsModalOpen(true);
  };

  const handleSave = async (apiPayload) => {
    try {
      console.log("Sending data to API:", apiPayload);
      await updateUserAnimeStatus(anime.id, apiPayload);
      alert("Cập nhật thành công!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu trạng thái:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khỏi danh sách?")) {
      console.log("Thực hiện xóa...");
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
        initialData={currentStatusData} /* Truyền dữ liệu lấy được vào Modal */
        onSave={handleSave} 
        onDelete={handleDelete}
      />
    </>
  );
};

export default SummarySection;