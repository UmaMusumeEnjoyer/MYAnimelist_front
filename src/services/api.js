// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api' // Đảm bảo URL này đúng với backend của bạn
});

// =================================================================
// CACHING UTILITIES
// =================================================================

const simpleCache = {};
const defaultTTL = 1000 * 60 * 20; // 20 phút

function getCached(key) {
  const entry = simpleCache[key];
  if (!entry) return null;
  if (Date.now() > entry.exp) {
    delete simpleCache[key];
    return null;
  }
  return entry.val;
}

function setCached(key, val, ttl = defaultTTL) {
  simpleCache[key] = { val, exp: Date.now() + ttl };
}

// =================================================================
// INTERCEPTOR (Đã chỉnh sửa để Debug lỗi 401)
// =================================================================

API.interceptors.request.use((config) => {
  // 1. Kiểm tra đúng tên key bạn đã lưu lúc Login (VD: 'authToken' hoặc 'access_token')
  const token = localStorage.getItem('authToken'); 
  
  // LOG DEBUG: Kiểm tra xem token có null không?
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} | Token:`, token ? "Found" : "Missing");

  if (token) {
    // ----------------------------------------------------------------
    // QUAN TRỌNG: Chọn loại Header phù hợp với Backend của bạn
    // ----------------------------------------------------------------
    
    // Cách 1: Dùng cho JWT (JSON Web Token) - Phổ biến
    config.headers.Authorization = `Bearer ${token}`; 
    
    // Cách 2: Dùng cho DRF Token Authentication (Mặc định của Django REST Framework)
    // Nếu Cách 1 bị lỗi 401, hãy comment dòng trên và bỏ comment dòng dưới này:
    // config.headers.Authorization = `Token ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


// =================================================================
// ANIME, CHARACTER & STAFF API (Đã áp dụng cache)
// =================================================================

export const getAnimeById = (id) => {
  const key = `anime:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeCharacters = (id) => {
  const key = `anime:${id}:characters`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/characters/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeStaff = (id) => {
  const key = `anime:${id}:staff`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/staffs/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeStats = (id) => {
  const key = `anime:${id}:stats`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });
  
  return API.get(`/anilist/anime/${id}/stats/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getAnimeCharacter = (id) => {
  const key = `character:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/character/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

export const getStaffById = (id) => {
  const key = `staff:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/staff/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};


// =================================================================
// AUTHENTICATION API (Không áp dụng cache)
// =================================================================

export const register = (userData) => {
  return API.post('/auth/register/', userData);
};

export const login = (credentials) => {
  return API.post('/auth/login/', credentials);
};


// =================================================================
// USER ACTIVITY API
// =================================================================

/**
 * Cập nhật trạng thái theo dõi anime của người dùng
 * @param {number|string} animeId - ID của anime (VD: 178701)
 * @param {object} data - Dữ liệu body (status, progress, date, etc.)
 */
export const updateUserAnimeStatus = (animeId, data) => {
  // Clear cache related to user stats if necessary (optional logic)
  return API.post(`/follow/${animeId}/create/`, data);
};

/**
 * [MỚI] Cập nhật thông tin theo dõi (Update)
 * Chỉ cập nhật: episode_progress, watch_status, isFavorite, user_note
 */
export const updateUserAnimeFollow = (animeId, data) => {
  // Sử dụng PUT hoặc PATCH tùy vào cấu hình Backend của bạn (thường update là PUT)
  return API.put(`/follow/${animeId}/update/`, data);
};

/**
 * [MỚI] Xóa anime khỏi danh sách theo dõi
 * URL: /api/follow/{anilist_id}/delete/
 */
export const deleteUserAnimeFollow = (animeId) => {
  // Sử dụng method DELETE (hoặc POST tùy vào backend của bạn cấu hình, nhưng chuẩn REST là DELETE)
  return API.delete(`/follow/${animeId}/delete/`);
};

// =================================================================
// USER API (MỚI)
// =================================================================

export const getUserAnimeList = (username) => {
  // Không cache API này để cập nhật trạng thái xem mới nhất
  return API.get(`/user/${username}/animelist`);
};

/**
 * [MỚI] Lấy trạng thái theo dõi hiện tại của người dùng đối với anime
 * URL: /api/follow/{anilist_id}/get
 */
export const getUserAnimeStatus = (animeId) => {
  // Không cache API này để đảm bảo dữ liệu luôn mới nhất khi mở modal
  return API.get(`/follow/${animeId}/get`); 
};