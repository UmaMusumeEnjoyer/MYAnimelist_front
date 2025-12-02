// src/components/VerifyEmail.js
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/api'; // Import hàm vừa tạo ở Bước 1
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            // 1. Lấy token từ URL (ví dụ: ?token=xyz...)
            const token = searchParams.get('token');

            if (!token) {
                toast.error("Invalid verification link.");
                // Chờ 3s rồi chuyển về login nếu link lỗi
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            try {
                // 2. Gọi API xác thực
                // URL sẽ là: https://doannguyen.pythonanywhere.com/api/auth/verify-email/?token={token}
                const response = await verifyEmail(token);

                // 3. Xử lý thành công
                toast.success(response.data.message || "Email verified successfully! You can now login.");
                
                // Đợi 2 giây để người dùng đọc thông báo rồi chuyển sang trang Login
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } catch (error) {
                // 4. Xử lý lỗi
                console.error(error);
                const errorMessage = error.response?.data?.error || "Verification failed. Please try again.";
                toast.error(errorMessage);
                
                // Vẫn chuyển về login sau khi báo lỗi để họ thử đăng nhập hoặc gửi lại mail
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        verify();
    }, [searchParams, navigate]);

    // Giao diện hiển thị trong lúc đang xử lý (Loading...)
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#152232', // Màu nền giống AuthPage
            color: '#c2c2c2',
            flexDirection: 'column'
        }}>
            <ToastContainer position="top-right" autoClose={5000} />
            <h2>Verifying your email...</h2>
            <p>Please wait a moment while we process your request.</p>
        </div>
    );
};

export default VerifyEmail;