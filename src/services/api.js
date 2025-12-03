// src/services/api.js
import axios from 'axios';

const API = axios.create({
  //baseURL: 'http://localhost:8000/api' // Đảm bảo URL này đúng với backend của bạn
  baseURL: 'https://doannguyen.pythonanywhere.com/api'
});

// =================================================================
// CACHING UTILITIES
// =================================================================

const simpleCache = {};
const defaultTTL = 1000 * 60 * 20; // 20 phút
const shortTTL = 1000 * 60 * 5;    // 5 phút (Dành cho thống kê User)

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
// INTERCEPTOR (Xử lý Token)
// =================================================================

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); 
  
  // LOG DEBUG: Kiểm tra token (Có thể comment lại khi production)
  // console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} | Token:`, token ? "Found" : "Missing");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const verifyEmail = (token) => {
    // Gọi trực tiếp đến URL backend bạn yêu cầu với token
    return axios.get(`https://doannguyen.pythonanywhere.com/api/auth/verify-email/?token=${token}`);
};

// =================================================================
// ANIME, CHARACTER & STAFF API (Core Info - Có Cache)
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
// ANIME EXTRA INFO & SEARCH API
// (Đã thêm Cache cho Overview, WatchInfo và Trending)
// =================================================================

export const getAnimeOverview = (id) => {
  const key = `anime:${id}:overview`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/overview/`).then(res => {
    setCached(key, res.data); // Cache default 20p
    return res;
  });
};

export const getAnimeWatchInfo = (id) => {
  const key = `anime:${id}:watch`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/anilist/anime/${id}/watch/`).then(res => {
    setCached(key, res.data); // Cache default 20p
    return res;
  });
};

export const searchAnimeByName = (keyword) => {
  // KHÔNG CACHE: Search dynamic
  return API.post('/anilist/search/name/', { 
    name: keyword,
    manual: true 
  });
};

export const getTrendingAnime = () => {
  const key = `search:trending`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get('/anilist/search/trending/').then(res => {
    setCached(key, res.data); // Cache default 20p
    return res;
  });
};

export const searchAnimeByCriteria = (criteria) => {
  // KHÔNG CACHE: Criteria dynamic
  return API.post('/anilist/search/criteria/', criteria);
};


// =================================================================
// AUTHENTICATION API (Không Cache)
// =================================================================

export const register = (userData) => {
  return API.post('/auth/register/', userData);
};

export const login = (credentials) => {
  return API.post('/auth/login/', credentials);
};


// =================================================================
// USER ACTIVITY (Follow/Tracking - Không Cache)
// =================================================================

export const updateUserAnimeStatus = (animeId, data) => {
  return API.post(`/follow/${animeId}/create/`, data);
};

export const updateUserAnimeFollow = (animeId, data) => {
  return API.put(`/follow/${animeId}/update/`, data);
};

export const deleteUserAnimeFollow = (animeId) => {
  return API.delete(`/follow/${animeId}/delete/`);
};

export const getUserAnimeStatus = (animeId) => {
  return API.get(`/follow/${animeId}/get`); 
};


// =================================================================
// USER PROFILE & DASHBOARD API
// (Đã thêm Cache ngắn hạn cho Heatmap & Activity)
// =================================================================

export const getUserProfile = (username) => {
  return API.get(`/user/${username}/profile/`);
};

export const updateUserProfile = (userData) => {
  // userData là object chứa các field cần sửa, ví dụ:
  // { first_name: "John", last_name: "Doe", username: "xuctu" }
  return API.put('/user/profile/update/', userData);
};

export const getUserAnimeList = (username) => {
  // KHÔNG CACHE: List thay đổi thường xuyên khi user update
  return API.get(`/user/${username}/animelist`);
};

export const deleteUserAvatar = () => {
  return API.delete('/user/avatar/delete/');
};

export const uploadUserAvatar = (file) => {
  const formData = new FormData();
  formData.append('avatar', file); // Key 'avatar' phải khớp với yêu cầu Backend

  return API.post('/user/avatar/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Bắt buộc khi gửi file
    },
  });
};

export const getUserHeatmap = (username) => {
  const key = `user:${username}:heatmap`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/user/${username}/overview/heatmap`).then(res => {
    setCached(key, res.data, shortTTL); // Cache 5 phút
    return res;
  });
};

export const getUserActivity = (username) => {
  const key = `user:${username}:activity`;
  const cached = getCached(key);
  if (cached) return Promise.resolve({ data: cached });

  return API.get(`/user/${username}/overview/activity`).then(res => {
    setCached(key, res.data, shortTTL); // Cache 5 phút
    return res;
  });
};

export const searchUsers = (keyword) => {
  // Giả định backend có endpoint search user
  // Nếu chưa có, bạn cần implement endpoint này ở backend
  return API.get(`/user/search/`, { params: { q: keyword } });
};

// =================================================================
// CUSTOM LIST MANAGEMENT (CRUD - Không Cache)
// =================================================================

export const getUserCustomLists = (username = null) => {
  const url = username 
    ? `/list/user/?username=${username}` 
    : '/list/user/';
  return API.get(url);
};

export const createCustomList = (listData) => {
  return API.post('/list/create/', listData);
};

export const updateCustomList = (listId, listData) => {
  return API.put(`/list/${listId}/update/`, listData);
};

export const deleteCustomList = (listId) => {
  return API.delete(`/list/${listId}/delete/`);
};


// =================================================================
// CUSTOM LIST CONTENT (ANIME IN LIST - Không Cache)
// =================================================================

export const getCustomListItems = (listId) => {
  return API.get(`/list/anime/${listId}/`);
};

export const addAnimeToCustomList = (listId, animeData) => {
  return API.post(`/list/anime/${listId}/add/`, animeData);
};

export const updateAnimeInCustomList = (listId, anilistId, data) => {
  return API.put(`/list/anime/${listId}/${anilistId}/update/`, data);
};

export const removeAnimeFromCustomList = (listId, anilistId) => {
  return API.delete(`/list/anime/${listId}/${anilistId}/remove/`);
};


// =================================================================
// CUSTOM LIST MEMBERS (Không Cache)
// =================================================================

export const getListMembers = (listId) => {
  return API.get(`/list/member/${listId}/list/`);
};

export const addMemberToList = (listId, userData) => {
  return API.post(`/list/member/${listId}/add/`, userData);
};

export const removeMemberFromList = (listId, username) => {
  return API.delete(`/list/member/${listId}/remove/`, { params: { username } });
};

export const updateMemberPermission = (listId, permissionData) => {
  return API.put(`/list/member/${listId}/permission/`, permissionData);
};

export const getMemberStatusInList = (listId) => {
  return API.get(`/list/member/${listId}/status/`);
};


// =================================================================
// CUSTOM LIST REQUESTS (JOIN & EDIT - Không Cache)
// =================================================================

export const getListRequests = (listId) => {
  return API.get(`/list/${listId}/requests/`);
};

export const requestJoinList = (listId, message) => {
  return API.post(`/list/${listId}/request-join/`, {
    request_type: "join", // Fix cứng theo yêu cầu
    message: message      // Nội dung message truyền từ giao diện
  });
};

export const respondToJoinRequest = (listId, requestId, responseData) => {
  return API.post(`/list/${listId}/join-requests/${requestId}/respond/`, responseData);
};

export const requestEditList = (listId, message) => {
    return API.post(`/list/${listId}/request-edit/`, {
    request_type: "edit_permission", // Fix cứng theo yêu cầu
    message: message      // Nội dung message truyền từ giao diện
  });
};

export const respondToEditRequest = (listId, requestId, responseData) => {
  return API.post(`/list/${listId}/edit-requests/${requestId}/respond/`, responseData);
};

// =================================================================
// CUSTOM LIST LIKES & TRENDING (Dựa trên hình ảnh cung cấp)
// =================================================================

/**
 * Toggle like cho một Custom List
 * Endpoint: POST /api/list/{list_id}/like/
 */
export const toggleLikeList = (listId) => {
  return API.post(`/list/${listId}/like/`);
};

/**
 * Kiểm tra xem User hiện tại đã like list này chưa
 * Endpoint: GET /api/list/{list_id}/like/status/
 */
export const getListLikeStatus = (listId) => {
  return API.get(`/list/${listId}/like/status/`);
};

/**
 * Lấy danh sách những người đã like List này
 * Endpoint: POST /api/list/{list_id}/likers/
 * (Dùng POST có thể do backend cần nhận body phân trang hoặc filter)
 */
export const getListLikers = (listId, data = {}) => {
  return API.post(`/list/${listId}/likers/`, data);
};

/**
 * Lấy danh sách các List mà một User cụ thể đã like
 * Endpoint: POST /api/list/likes/user/
 */
export const getListsLikedByUser = (data = {}) => {
  // data có thể chứa { username: "abc", page: 1, ... }
  return API.post('/list/likes/user/', data);
};

/**
 * Lấy danh sách các List đang thịnh hành (Trending)
 * Endpoint: POST /api/list/likes/trending/
 */
export const getTrendingLists = (data = {}) => {
  return API.post('/list/likes/trending/', data);
};

/**
 * Lấy danh sách các List được like nhiều nhất (Most Liked)
 * Endpoint: POST /api/list/likes/most-liked/
 */
export const getMostLikedLists = () => {
  return API.post('/list/likes/most-liked/', { 
    limit: 20 
  });
};

// =================================================================
// CUSTOM LIST SEARCH
// =================================================================

export const searchCustomLists = (keyword) => {
  return API.post('/list/search/', {
    query: keyword,
    limit: 20 // Limit được fix cứng là 20 theo yêu cầu
  });
};

