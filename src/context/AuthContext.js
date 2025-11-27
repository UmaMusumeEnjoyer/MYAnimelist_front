// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api'; // Đổi tên và dùng alias 'apiLogin'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra trạng thái đăng nhập khi load lại trang (tùy chọn)
    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Giả sử bạn lưu token
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

const login = async (email, password) => {
        try {
            const response = await apiLogin({ email, password });
            
            // --- PHẦN ĐÃ SỬA ---
            // 1. Lấy token từ đúng cấu trúc JSON bạn cung cấp
            const accessToken = response.data.tokens.access;
            const refreshToken = response.data.tokens.refresh; 

            // 2. Lưu token vào localStorage (Bỏ comment cũ)
            if (accessToken) {
                localStorage.setItem('authToken', accessToken);
                // Lưu luôn refresh token để sau này dùng (tùy chọn)
                localStorage.setItem('refreshToken', refreshToken); 
                
                setIsAuthenticated(true);
                navigate('/homepagelogin');
                return { success: true, message: 'Login successful!' };
            } else {
                 return { success: false, message: 'Token not found in response' };
            }
            // -------------------

        } catch (error) {
            // ... (Phần xử lý lỗi giữ nguyên như cũ)
            setIsAuthenticated(false);
            let errorMessage = 'Login failed. Please try again.';
            // ... copy lại phần xử lý lỗi cũ của bạn vào đây
            return { success: false, message: errorMessage };
        }
    };

    const logout = () => {
            // --- PHẦN ĐÃ SỬA ---
            // Bỏ comment để xóa token khi đăng xuất
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken'); // Xóa cả refresh token nếu có lưu
            // -------------------
            
            setIsAuthenticated(false);
            navigate('/login'); 
        };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để dễ dàng sử dụng context
export const useAuth = () => {
    return useContext(AuthContext);
};