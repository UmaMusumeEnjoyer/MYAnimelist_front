// src/components/AuthPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

// Import các hàm cần thiết
import { register } from '../../services/api'; // Đổi tên ở đây
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ context

    // State cho các trường input
    const [registerData, setRegisterData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        setIsActive(location.pathname === '/signup');
    }, [location.pathname]);

    // Hàm xử lý thay đổi input
    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý submit form đăng ký
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirm_password) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            const response = await register(registerData);
            toast.success(response.data.message || 'Registration successful! Please login.');
            navigate('/login'); // Chuyển sang trang đăng nhập sau khi đăng ký thành công
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // Nếu có object 'details' chứa lỗi của từng trường
                if (errorData.details) {
                    // Lặp qua các key trong object 'details' (ví dụ: 'username', 'email')
                    for (const field in errorData.details) {
                        // errorData.details[field] là một mảng các thông báo lỗi
                        errorData.details[field].forEach(message => {
                            toast.error(message); // Hiển thị từng thông báo lỗi
                        });
                    }
                } else if (errorData.error) {
                    // Nếu chỉ có một thông báo lỗi chung
                    toast.error(errorData.error);
                } else {
                    // Trường hợp lỗi không xác định
                    toast.error('An unexpected error has occurred. Please try again.');
                }
            } else {
                // Lỗi mạng hoặc server không phản hồi
                toast.error('Unable to connect to the server.');
            }
        }
    };
    
    // Hàm xử lý submit form đăng nhập
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await login(loginData.email, loginData.password);
        if (result.success) {
            toast.success(result.message);
            // navigate('/') đã được xử lý trong AuthContext
        } else {
            toast.error(result.message);
        }
    };

    const handleRegisterClick = () => navigate('/signup');
    const handleLoginClick = () => navigate('/login');

    return (
        <div className={styles.authPageWrapper}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <div className={`${styles.container} ${isActive ? styles.active : ''}`} id="container">
                {/* Form Đăng Ký */}
                <div className={`${styles.formContainer} ${styles.signUp}`}>
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Sign up to MyAniList</h1>
                        <input name="email" type="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} required />
                        <input name="username" type="text" placeholder="Username" value={registerData.username} onChange={handleRegisterChange} required />
                        <input name="password" type="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
                        <input name="confirm_password" type="password" placeholder="Confirm Password" value={registerData.confirm_password} onChange={handleRegisterChange} required />
                        <div className={styles.terms}>
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms">You agree to our terms of service</label>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                {/* Form Đăng Nhập */}
                <div className={`${styles.formContainer} ${styles.signIn}`}>
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Sign In</h1>
                        <div className={styles.socialIcons}>
                            {/* ... social icons ... */}
                        </div>
                        <span>or use your email password</span>
                        <input name="email" type="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} required />
                        <input name="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
                        <a href="#">Forget Your Password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                {/* Overlay */}
                <div className={styles.toggleContainer}>
                    <div className={styles.toggle}>
                        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                            <h1>Welcome Back!</h1>
                            <button className={styles.hidden} onClick={handleLoginClick}>Sign In</button>
                        </div>
                        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                            <h1>Hello, Friend!</h1>
                            <button className={styles.hidden} onClick={handleRegisterClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;