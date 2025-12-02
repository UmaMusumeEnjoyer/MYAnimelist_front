// src/components/AuthPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'; // Thêm useSearchParams
import styles from './AuthPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

// Import các hàm cần thiết
// Đảm bảo bạn đã export verifyEmail trong api.js như file bạn gửi
import { register, verifyEmail } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // Hook để lấy query params (token)
    const { login } = useAuth();

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

    // 1. Logic chuyển đổi Sign In / Sign Up dựa trên URL
    useEffect(() => {
        setIsActive(location.pathname === '/signup');
    }, [location.pathname]);

    // 2. Logic Xử lý Verify Email (THÊM MỚI ĐOẠN NÀY)
    useEffect(() => {
        const verifyToken = async () => {
            // Lấy token từ URL: ?token=...
            const token = searchParams.get('token');
            
            if (token) {
                try {
                    // Gọi API verifyEmail đã định nghĩa trong api.js
                    await verifyEmail(token);
                    
                    toast.success("Email verified successfully! Please login.");
                    
                    // Sau khi verify xong, chuyển hướng về /login để xóa token trên URL
                    // Vì AuthPage mặc định hiện Sign In nên giao diện vẫn giữ nguyên, chỉ URL sạch hơn.
                    navigate('/login', { replace: true });
                    
                } catch (error) {
                    const errorMsg = error.response?.data?.error || "Verification failed. The link may be invalid or expired.";
                    toast.error(errorMsg);
                    // Vẫn chuyển về login sạch để người dùng thử lại hoặc đăng nhập
                    navigate('/login', { replace: true });
                }
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    // ... Các hàm handleChange và handleSubmit giữ nguyên ...
    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirm_password) {
            toast.error("Passwords do not match!");
            return;
        }
        try {
            const response = await register(registerData);
            toast.success(response.data.message || 'Registration successful! Please login.');
            navigate('/login'); 
        } catch (error) {
            // ... (Code xử lý lỗi giữ nguyên như cũ) ...
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.details) {
                    for (const field in errorData.details) {
                        errorData.details[field].forEach(message => toast.error(message));
                    }
                } else if (errorData.error) {
                    toast.error(errorData.error);
                } else {
                    toast.error('An unexpected error has occurred.');
                }
            } else {
                toast.error('Unable to connect to the server.');
            }
        }
    };
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await login(loginData.email, loginData.password);
        if (result.success) {
            toast.success(result.message);
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
                        {/* ... nội dung form giữ nguyên ... */}
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
                        {/* ... nội dung form giữ nguyên ... */}
                        <h1>Sign In</h1>
                        <div className={styles.socialIcons}>
                             {/* ... social icons ... */}
                             <a href="#" className="icon"><FontAwesomeIcon icon={faGooglePlusG} /></a>
                             <a href="#" className="icon"><FontAwesomeIcon icon={faFacebookF} /></a>
                             <a href="#" className="icon"><FontAwesomeIcon icon={faGithub} /></a>
                             <a href="#" className="icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
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