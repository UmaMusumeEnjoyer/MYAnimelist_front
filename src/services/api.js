// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api' // Đảm bảo URL này đúng với backend của bạn
});

// =================================================================
// CACHING UTILITIES
// =================================================================

const simpleCache = {};
const defaultTTL = 1000 * 60 * 5; // 5 phút

/**
 * Lấy dữ liệu từ cache nếu có và chưa hết hạn.
 * @param {string} key - Khóa cache
 * @returns {any | null} - Dữ liệu đã cache hoặc null
 */
function getCached(key) {
  const entry = simpleCache[key];
  if (!entry) {
    // console.log(`[Cache] MISS: ${key}`);
    return null;
  }

  if (Date.now() > entry.exp) {
    // console.log(`[Cache] EXPIRED: ${key}`);
    delete simpleCache[key];
    return null;
  }

  // console.log(`[Cache] HIT: ${key}`);
  return entry.val;
}

/**
 * Lưu dữ liệu vào cache với một Time-To-Live (TTL).
 * @param {string} key - Khóa cache
 * @param {any} val - Dữ liệu cần cache
 * @param {number} ttl - Thời gian sống của cache (ms)
 */
function setCached(key, val, ttl = defaultTTL) {
  // console.log(`[Cache] SET: ${key} (TTL: ${ttl}ms)`);
  simpleCache[key] = { val, exp: Date.now() + ttl };
}


// =================================================================
// ANIME, CHARACTER & STAFF API (Đã áp dụng cache)
// =================================================================

/**
 * Lấy thông tin chi tiết của một anime dựa vào ID.
 */
export const getAnimeById = (id) => {
  console.log(`Requesting data for anime ID: ${id}`);
  const key = `anime:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

/**
 * Lấy danh sách nhân vật của một anime dựa vào ID.
 */
export const getAnimeCharacters = (id) => {
  const key = `anime:${id}:characters`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/characters/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

/**
 * Lấy danh sách staff của một anime dựa vào ID.
 */
export const getAnimeStaff = (id) => {
  const key = `anime:${id}:staff`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/staffs/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

/**
 * Lấy dữ liệu thống kê (rankings, distribution) của một anime.
 */
export const getAnimeStats = (id) => {
  const key = `anime:${id}:stats`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });
  
  return API.get(`/anilist/anime/${id}/stats/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

/**
 * Lấy thông tin chi tiết của một nhân vật.
 */
export const getAnimeCharacter = (id) => {
  const key = `character:${id}:detail`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/character/${id}/`).then(res => {
    setCached(key, res.data);
    return res;
  });
};

/**
 * Lấy dữ liệu chi tiết của một staff (diễn viên, đạo diễn, etc.).
 */
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

/**
 * Gửi yêu cầu đăng ký người dùng mới.
 */
export const register = (userData) => {
  return API.post('/auth/register/', userData);
};

/**
 * Gửi yêu cầu đăng nhập.
 */
export const login = (credentials) => {
  return API.post('/auth/login/', credentials);
};

