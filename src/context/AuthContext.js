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
            const response = await apiLogin({ email, password }); // Gọi hàm với tên alias
            // Giả sử API trả về token khi thành công
            // localStorage.setItem('authToken', response.data.token); 
            setIsAuthenticated(true);
            navigate('/'); // Chuyển hướng về trang chủ
            return { success: true, message: response.data.message || 'Login successful!' };
        } catch (error) {
            setIsAuthenticated(false);
            let errorMessage = 'Login failed. Please try again.'; // Mặc định

            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // Kiểm tra lỗi chi tiết trong 'details' và 'non_field_errors'
                if (errorData.details && errorData.details.non_field_errors && errorData.details.non_field_errors.length > 0) {
                    errorMessage = errorData.details.non_field_errors[0]; // Lấy thông báo lỗi đầu tiên
                } else if (errorData.error) {
                    // Fallback nếu có trường 'error'
                    errorMessage = errorData.error;
                }
            } else {
                errorMessage = 'Unable to connect to the server.';
            }
            
            return { success: false, message: errorMessage };
        }
    };

    const logout = () => {
        // localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        navigate('/login'); // Chuyển về trang đăng nhập
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