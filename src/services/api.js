// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api' // Đảm bảo URL này đúng với backend của bạn
});

// =================================================================
// ANIME, CHARACTER & STAFF API (Phần bạn đã có)
// =================================================================

/**
 * Lấy thông tin chi tiết của một anime dựa vào ID.
 * @param {number} id - ID của anime cần lấy.
 * @returns {Promise} - Promise chứa dữ liệu anime từ API.
 */
export const getAnimeById = (id) => {
  console.log(`Requesting data for anime ID: ${id}`);
  return API.get(`/anilist/anime/${id}/`);
};

/**
 * Lấy danh sách nhân vật của một anime dựa vào ID.
 * @param {number} id - ID của anime.
 * @returns {Promise} - Promise chứa dữ liệu nhân vật.
 */
export const getAnimeCharacters = (id) => {
  return API.get(`/anilist/anime/${id}/characters/`);
};

/**
 * Lấy danh sách staff của một anime dựa vào ID.
 * @param {number} id - ID của anime.
 * @returns {Promise} - Promise chứa dữ liệu staff.
 */
export const getAnimeStaff = (id) => {
  return API.get(`/anilist/anime/${id}/staffs/`);
};

/**
 * Lấy dữ liệu thống kê (rankings, distribution) của một anime.
 * @param {number} id - ID của anime.
 * @returns {Promise} - Promise chứa dữ liệu stats.
 */
export const getAnimeStats = (id) => {
  return API.get(`/anilist/anime/${id}/stats/`);
};

/**
 * Lấy thông tin chi tiết của một nhân vật.
 * @param {number} id - ID của nhân vật.
 * @returns {Promise} - Promise chứa dữ liệu nhân vật.
 */
export const getAnimeCharacter = (id) => {
  return API.get(`/anilist/character/${id}/`);
};

/**
 * Lấy dữ liệu chi tiết của một staff (diễn viên, đạo diễn, etc.).
 * @param {number} id - ID của staff.
 * @returns {Promise} - Promise chứa dữ liệu staff.
 */
export const getStaffById = (id) => {
  return API.get(`/anilist/staff/${id}/`);
};


// =================================================================
// AUTHENTICATION API (Phần mới thêm vào)
// =================================================================

/**
 * Gửi yêu cầu đăng ký người dùng mới.
 * @param {object} userData - Dữ liệu người dùng, bao gồm { username, email, password, confirm_password }.
 * @returns {Promise} - Promise chứa phản hồi từ API.
 */
export const register = (userData) => {
  return API.post('/auth/register/', userData);
};

/**
 * Gửi yêu cầu đăng nhập.
 * @param {object} credentials - Thông tin đăng nhập, bao gồm { email, password }.
 * @returns {Promise} - Promise chứa phản hồi từ API (thường là token).
 */
export const login = (credentials) => {
  return API.post('/auth/login/', credentials);
};