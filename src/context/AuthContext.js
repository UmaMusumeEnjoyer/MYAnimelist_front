// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, getUserProfile } from '../services/api'; // [UPDATE] Import thêm getUserProfile

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // [NEW] State lưu thông tin user (avatar, username, name...)
    const [user, setUser] = useState(null); 
    const navigate = useNavigate();

    // Hàm helper để fetch thông tin user từ server
    const fetchUserInfo = async (username) => {
        try {
            const res = await getUserProfile(username);
            if (res.data) {
                setUser(res.data); // Lưu toàn bộ info user vào context
            }
        } catch (error) {
            console.error("Failed to fetch user info in context", error);
        }
    };

    // Kiểm tra trạng thái đăng nhập khi load lại trang
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const storedUsername = localStorage.getItem('username');

        if (token) {
            setIsAuthenticated(true);
            // [NEW] Nếu có token và username, tự động lấy thông tin user để cập nhật Avatar ngay khi load trang
            if (storedUsername) {
                fetchUserInfo(storedUsername);
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiLogin({ email, password });
            
            const accessToken = response.data.tokens.access;
            const refreshToken = response.data.tokens.refresh; 
            const username = response.data.user ? response.data.user.username : null;

            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken); 
                if (username) {
                    localStorage.setItem('username', username);
                }
                
                setIsAuthenticated(true);
                
                // [NEW] Gọi fetch info ngay sau khi login thành công để Header có avatar ngay
                if (username) {
                    await fetchUserInfo(username);
                }

                navigate('/homepagelogin');
                return { success: true, message: 'Login successful!' };
            } else {
                 return { success: false, message: 'Token not found in response' };
            }

        } catch (error) {
            setIsAuthenticated(false);
            setUser(null); // Reset user nếu lỗi
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    const logout = () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username'); // Xóa username
            
            setIsAuthenticated(false);
            setUser(null); // [NEW] Xóa thông tin user trong state
            navigate('/login'); 
    };

    // [NEW] Hàm này để ProfilePage gọi khi update thành công
    const updateUserContext = (newUserData) => {
        setUser(prev => ({
            ...prev,
            ...newUserData
        }));
    };

    return (
        // Truyền user và updateUserContext xuống cho các component con dùng
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUserContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};