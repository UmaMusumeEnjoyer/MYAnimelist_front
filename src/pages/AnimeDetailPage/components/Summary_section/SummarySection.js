// src/pages/components/SummarySection.js
import React, { useState, useEffect } from 'react';
import EditorModal from './EditorModal'; // Đảm bảo đường dẫn import đúng
import { updateUserAnimeStatus, getUserAnimeStatus } from '../../../../services/api'; 
import './SummarySection.css';

const SummarySection = ({ anime, hasBanner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatusData, setCurrentStatusData] = useState(null); // State lưu dữ liệu tracking
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Map hiển thị Text trên Button dựa vào status
  const statusMap = {
    'watching': 'Watching',
    'plan_to_watch': 'Plan to Watch',
    'completed': 'Completed',
    'dropped': 'Dropped',
    'on_hold': 'On Hold'
  };

  // 1. [MỚI] Tự động lấy dữ liệu theo dõi khi load trang (mount)
  useEffect(() => {
    const fetchUserStatus = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !anime?.id) return;

      setIsLoadingStatus(true);
      try {
        const response = await getUserAnimeStatus(anime.id);
        if (response && response.data) {
          setCurrentStatusData(response.data);
        }
      } catch (error) {
        // Lỗi 404 nghĩa là chưa follow, không cần log error đỏ lòm
        // console.log("User has not followed this anime yet.");
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

  // 2. [CHỈNH SỬA] Hàm handleSave xử lý cả trường hợp Create và Update UI
  const handleSave = async (apiPayload, isUpdateMode = false) => {
    try {
      if (isUpdateMode) {
        // TRƯỜNG HỢP UPDATE:
        // EditorModal đã gọi API update rồi. 
        // Ta chỉ cần cập nhật state UI bên ngoài để nút bấm đổi chữ ngay lập tức.
        setCurrentStatusData(prev => ({
          ...prev,
          ...apiPayload // Ghi đè các trường mới (status, score, progress...)
        }));
      } else {
        // TRƯỜNG HỢP CREATE (Lần đầu add vào list):
        // Gọi API tạo mới tại đây (như logic cũ)
        const response = await updateUserAnimeStatus(anime.id, apiPayload);
        
        // Sau khi tạo xong, cập nhật state để nút chuyển từ "Add to List" -> Status
        // Giả sử backend trả về data vừa tạo, hoặc ta tự construct object
        setCurrentStatusData({
            ...apiPayload,
            anime: anime.id
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
    if (window.confirm("Bạn có chắc chắn muốn xóa khỏi danh sách?")) {
      // Gọi API xóa ở đây (nếu có)
      // await deleteUserAnimeStatus(anime.id);
      setCurrentStatusData(null); // Reset nút về trạng thái ban đầu
      setIsModalOpen(false);
    }
  };

  // Xác định label cho nút bấm
  const buttonLabel = isLoadingStatus 
    ? 'Loading...' 
    : (currentStatusData ? (statusMap[currentStatusData.watch_status] || 'Unknown') : 'Add to List');

  // Xác định class màu cho nút bấm (Optional: custom màu theo status)
  const buttonClass = currentStatusData ? 'btn-watching' : 'btn-watching'; // Có thể sửa thành 'btn-add' nếu muốn màu khác

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