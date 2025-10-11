// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api' // Đảm bảo URL này đúng với backend của bạn
});

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
 * Lấy dữ liệu thống kê (rankings, distribution) của một anime.
 * @param {number} id - ID của anime.
 * @returns {Promise} - Promise chứa dữ liệu stats.
 */
export const getAnimeCharacter = (id) => {
  return API.get(`/anilist/character/${id}/`);
};

// src/api/api.js
// ... các hàm khác

/**
 * Lấy dữ liệu chi tiết của một staff (diễn viên, đạo diễn, etc.).
 * @param {number} id - ID của staff.
 * @returns {Promise} - Promise chứa dữ liệu staff.
 */
export const getStaffById = (id) => {
  return API.get(`/anilist/staff/${id}/`); // Giả sử đây là endpoint của bạn
};