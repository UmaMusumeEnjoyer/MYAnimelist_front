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
// INTERCEPTOR (Xử lý Token)
// =================================================================

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); 
  
  // LOG DEBUG: Kiểm tra token
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url} | Token:`, token ? "Found" : "Missing");

  if (token) {
    // Cách 1: Dùng cho JWT (JSON Web Token)
    config.headers.Authorization = `Bearer ${token}`; 
    
    // Cách 2: Dùng cho DRF Token Authentication (Nếu backend dùng cái này thì bỏ comment)
    // config.headers.Authorization = `Token ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


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
// [MỚI] ANIME EXTRA INFO & SEARCH API
// (Bổ sung đầy đủ endpoint Search & Overview)
// =================================================================

export const getAnimeOverview = (id) => {
  // GET /api/anilist/anime/<id>/overview/
  return API.get(`/anilist/anime/${id}/overview/`);
};

export const getAnimeWatchInfo = (id) => {
  // GET /api/anilist/anime/<id>/watch/
  return API.get(`/anilist/anime/${id}/watch/`);
};

export const searchAnimeByName = (keyword) => {
  // POST /api/anilist/search/name/
  // Backend yêu cầu bắt buộc phải có field "name"
  return API.post('/anilist/search/name/', { 
    name: keyword,  // <-- Dùng "name" (không dùng "search")
    manual: true 
  });
};

export const getTrendingAnime = () => {
  // GET /api/anilist/search/trending/
  return API.get('/anilist/search/trending/');
};

export const searchAnimeByCriteria = (criteria) => {
  // POST /api/anilist/search/criteria
  // criteria object VD: { year: 2023, season: 'WINTER', genre: 'Action' }
  return API.post('/anilist/search/criteria/', criteria);
};


// =================================================================
// AUTHENTICATION API
// =================================================================

export const register = (userData) => {
  return API.post('/auth/register/', userData);
};

export const login = (credentials) => {
  return API.post('/auth/login/', credentials);
};


// =================================================================
// USER ACTIVITY (Follow/Tracking Anime)
// =================================================================

export const updateUserAnimeStatus = (animeId, data) => {
  // POST /api/follow/{anilist_id}/create/
  return API.post(`/follow/${animeId}/create/`, data);
};

export const updateUserAnimeFollow = (animeId, data) => {
  // PUT /api/follow/{anilist_id}/update/
  return API.put(`/follow/${animeId}/update/`, data);
};

export const deleteUserAnimeFollow = (animeId) => {
  // DEL /api/follow/{anilist_id}/delete/
  return API.delete(`/follow/${animeId}/delete/`);
};

export const getUserAnimeStatus = (animeId) => {
  // GET /api/follow/{anilist_id}/get
  return API.get(`/follow/${animeId}/get`); 
};


// =================================================================
// USER PROFILE & DASHBOARD API
// =================================================================

export const getUserAnimeList = (username) => {
  // GET /api/user/{username}/animelist
  return API.get(`/user/${username}/animelist`);
};

export const getUserHeatmap = (username) => {
  // GET /api/user/{username}/overview/heatmap
  return API.get(`/user/${username}/overview/heatmap`);
};

export const getUserActivity = (username) => {
  // GET /api/user/{username}/overview/activity
  return API.get(`/user/${username}/overview/activity`);
};


// =================================================================
// [MỚI] CUSTOM LIST MANAGEMENT (CRUD)
// (Quản lý tạo/sửa/xóa List)
// =================================================================

/**
 * Lấy danh sách Custom List
 * @param {string} username - Nếu có username: /api/list/user/?username=...
 * Nếu không: /api/list/user/ (Lấy của chính mình)
 */
export const getUserCustomLists = (username = null) => {
  const url = username 
    ? `/list/user/?username=${username}` 
    : '/list/user/';
  return API.get(url);
};

export const createCustomList = (listData) => {
  // POST /api/list/create/
  return API.post('/list/create/', listData);
};

export const updateCustomList = (listId, listData) => {
  // PUT /api/list/{list_id}/update/
  // Dùng chung cho Owner update, Member update privacy
  return API.put(`/list/${listId}/update/`, listData);
};

export const deleteCustomList = (listId) => {
  // DEL /api/list/{list_id}/delete/
  return API.delete(`/list/${listId}/delete/`);
};


// =================================================================
// [MỚI] CUSTOM LIST CONTENT (ANIME IN LIST)
// (Thêm/Sửa/Xóa phim trong List)
// =================================================================

export const getCustomListItems = (listId) => {
  // GET /api/list/anime/<list_id>/
  return API.get(`/list/anime/${listId}/`);
};

export const addAnimeToCustomList = (listId, animeData) => {
  // POST /api/list/anime/<list_id>/add/
  return API.post(`/list/anime/${listId}/add/`, animeData);
};

export const updateAnimeInCustomList = (listId, anilistId, data) => {
  // PUT /api/list/anime/<list_id>/<anilist_id>/update/
  return API.put(`/list/anime/${listId}/${anilistId}/update/`, data);
};

export const removeAnimeFromCustomList = (listId, anilistId) => {
  // DEL /api/list/anime/<list_id>/<anilist_id>/remove/
  return API.delete(`/list/anime/${listId}/${anilistId}/remove/`);
};


// =================================================================
// [MỚI] CUSTOM LIST MEMBERS
// (Quản lý thành viên trong List)
// =================================================================

export const getListMembers = (listId) => {
  // GET /api/list/member/{list_id}/list/
  return API.get(`/list/member/${listId}/list/`);
};

export const addMemberToList = (listId, userData) => {
  // POST /api/list/member/{list_id}/add/
  return API.post(`/list/member/${listId}/add/`, userData);
};

export const removeMemberFromList = (listId, username) => {
  // DEL /api/list/member/{list_id}/remove/?username={}
  // Axios delete params cần đặt trong object { params: ... }
  return API.delete(`/list/member/${listId}/remove/`, { params: { username } });
};

export const updateMemberPermission = (listId, permissionData) => {
  // PUT /api/list/member/{list_id}/permission/
  return API.put(`/list/member/${listId}/permission/`, permissionData);
};

export const getMemberStatusInList = (listId) => {
  // GET /api/list/member/{list_id}/status/
  return API.get(`/list/member/${listId}/status/`);
};


// =================================================================
// [MỚI] CUSTOM LIST REQUESTS (JOIN & EDIT)
// (Xin vào nhóm, xin quyền sửa)
// =================================================================

// --- Lấy danh sách yêu cầu ---
export const getListRequests = (listId) => {
  // GET /api/list/<list_id>/requests/
  return API.get(`/list/${listId}/requests/`);
};

// --- Yêu cầu tham gia (Join) ---
export const requestJoinList = (listId) => {
  // POST /api/list/<list_id>/request-join/
  return API.post(`/list/${listId}/request-join/`);
};

export const respondToJoinRequest = (listId, requestId, responseData) => {
  // POST /api/list/<list_id>/join-requests/<request_id>/respond/
  return API.post(`/list/${listId}/join-requests/${requestId}/respond/`, responseData);
};

// --- Yêu cầu chỉnh sửa (Edit) ---
export const requestEditList = (listId) => {
  // POST /api/list/<list_id>/request-edit/
  return API.post(`/list/${listId}/request-edit/`);
};

export const respondToEditRequest = (listId, requestId, responseData) => {
  // POST /api/list/<list_id>/edit-requests/<request_id>/respond/
  return API.post(`/list/${listId}/edit-requests/${requestId}/respond/`, responseData);
};