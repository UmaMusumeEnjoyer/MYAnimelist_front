import React from 'react';
import { FaHeart, FaListAlt } from 'react-icons/fa'; // Dùng icon List thay cho 3 ảnh
import { useNavigate } from 'react-router-dom';
import '../AnimeListSearchPage.css';

const SearchListCard = ({ listData }) => {
  /* Structure listData từ API search:
   {
      "list_id": 4,
      "list_name": "Umamusume",
      "description": "...",
      "color": "#ff5733",
      "like_count": 4,
      ...
   }
  */
  
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/list/${listData.list_id}`);
  };

  // Lấy màu từ API, nếu không có thì dùng màu mặc định
  const cardColor = listData.color || '#3db4f2';

  return (
    <div 
      className="anime-list-card" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC MÀU (Thay thế cho 3 ảnh preview) */}
      <div 
        className="alc-color-preview" 
        style={{ backgroundColor: cardColor }}
      >
        {/* Icon trang trí ở giữa */}
        <FaListAlt className="alc-color-icon" />
        
        {/* Nếu muốn hiển thị description ngắn đè lên màu (Optional) */}
        {/* <div className="alc-overlay" style={{background: 'transparent'}}></div> */}
      </div>

      {/* THÔNG TIN LIST */}
      <div className="alc-info">
        <h3 className="alc-title">{listData.list_name}</h3>
        
        {/* Hiển thị description nếu có vì Search Card này trống hơn Card thường */}
        {listData.description && (
             <p style={{
                 fontSize: '0.8rem', 
                 color: '#8BA0B2', 
                 margin: '5px 0 0',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 whiteSpace: 'nowrap'
             }}>
                 {listData.description}
             </p>
        )}

        <div className="alc-meta no-avatar">
          {/* Đã ẩn User Avatar theo yêu cầu */}
          
          {/* LIKES */}
          <div className="alc-likes">
            <FaHeart className="heart-icon"/> {listData.like_count ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchListCard;