import React from 'react';
import { FaHeart, FaLayerGroup } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../AnimeListSearchPage.css';

// --- CẤU HÌNH HẰNG SỐ & PLACEHOLDER ---
const BASE_URL = 'https://doannguyen.pythonanywhere.com'; // Domain gốc để nối chuỗi ảnh

const PLACEHOLDERS = {
  // 3 ảnh cover mặc định khi list chưa có anime nào
  coverImages: [
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDuy1eZV523.png",
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.jpg",
    "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20-Yfe1q3fW3qZ2.png"
  ],
  userAvatar: "https://i.pravatar.cc/150?img=68", // Avatar mặc định
  username: "Unknown User"
};

const AnimeListCard = ({ listData }) => {
  /* Cấu trúc listData mới:
    {
        "list_id": 4,
        "list_name": "Umamusume",
        "color": "#ff5733",
        "like_count": 3,
        "anime_count": 0,
        "owner": {
            "username": "dungtran",
            "avatar_url": "/media/avatars/..." (hoặc null)
        },
        "preview_anime": [] (Mảng chứa link ảnh hoặc object)
    }
  */
  
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/list/${listData.list_id}`);
  };

  // --- 1. XỬ LÝ AVATAR ---
  const getAvatar = () => {
    const owner = listData.owner;
    if (!owner || !owner.avatar_url) return PLACEHOLDERS.userAvatar;
    
    // Nếu avatar là link đầy đủ (http...) thì dùng luôn, nếu là path (/media...) thì nối domain
    return owner.avatar_url.startsWith('http') 
      ? owner.avatar_url 
      : `${BASE_URL}${owner.avatar_url}`;
  };

  // --- 2. XỬ LÝ USERNAME ---
  const getUsername = () => {
    return listData.owner?.username || PLACEHOLDERS.username;
  };

  // --- 3. XỬ LÝ ẢNH PREVIEW (Luôn đảm bảo hiển thị 3 ảnh) ---
  const getCoverImages = () => {
    // Lấy mảng ảnh từ API (giả sử API trả về mảng các string URL)
    const apiImages = listData.preview_anime || [];
    
    // Tạo mảng mới bắt đầu bằng ảnh từ API
    let displayImages = [...apiImages];

    // Nếu thiếu, điền thêm ảnh từ Placeholder cho đủ 3 ảnh
    if (displayImages.length < 3) {
      displayImages = [
        ...displayImages,
        ...PLACEHOLDERS.coverImages.slice(displayImages.length, 3)
      ];
    }
    
    // Cắt đúng 3 ảnh để hiển thị
    return displayImages.slice(0, 3);
  };

  const coverImages = getCoverImages();

  return (
    <div 
      className="anime-list-card" 
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* KHU VỰC 3 ẢNH PREVIEW */}
      <div className="alc-preview">
        {coverImages.map((img, index) => (
          <div 
            key={index} 
            className="alc-cover" 
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        
        {/* LỚP PHỦ HIỂN THỊ SỐ LƯỢNG ITEM */}
        <div className="alc-overlay">
            <span className="alc-count">
                {/* Lấy anime_count từ API, nếu null thì hiện 0 */}
                <FaLayerGroup /> {listData.anime_count ?? 0} items
            </span>
        </div>
      </div>

      {/* THÔNG TIN LIST */}
      <div className="alc-info">
        <h3 className="alc-title">{listData.list_name}</h3>
        
        <div className="alc-meta">
          {/* USER INFO */}
          <div className="alc-user">
            <img 
              src={getAvatar()} 
              alt="user" 
              className="alc-avatar"
              onError={(e) => { e.target.src = PLACEHOLDERS.userAvatar; }} // Fallback nếu ảnh lỗi
            />
            <span>{getUsername()}</span>
          </div>
          
          {/* LIKES */}
          <div className="alc-likes">
            <FaHeart className="heart-icon"/> {listData.like_count ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeListCard;