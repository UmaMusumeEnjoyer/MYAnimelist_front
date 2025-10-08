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

// Bạn có thể giữ lại hoặc xóa các hàm cũ không còn dùng đến
// export const getAiringAnime = ...
// export const getInProgressAnime = ...