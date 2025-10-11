// src/components/AuthPage.js

import React, { useState, useEffect } from 'react';
// Import các hook cần thiết từ React Router
import { useLocation, useNavigate } from 'react-router-dom'; 
import styles from './AuthPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faFacebookF, faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const AuthPage = () => {
    const [isActive, setIsActive] = useState(false);
    const location = useLocation(); // Lấy thông tin location
    const navigate = useNavigate(); // Dùng để điều hướng

    // useEffect sẽ chạy mỗi khi location.pathname (URL) thay đổi
    useEffect(() => {
        // Nếu URL là /signup, kích hoạt panel đăng ký, ngược lại thì thôi
        setIsActive(location.pathname === '/signup');
    }, [location.pathname]);

    // Khi bấm nút, chúng ta thay đổi URL thay vì chỉ set state
    const handleRegisterClick = () => {
        navigate('/signup');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className={styles.authPageWrapper}>
            {/* ClassName giờ sẽ được cập nhật bởi useEffect */}
            <div className={`${styles.container} ${isActive ? styles.active : ''}`} id="container">
                {/* Form Đăng Ký */}
                <div className={`${styles.formContainer} ${styles.signUp}`}>
                    <form>
                        <h1>Sign up to MyAniList</h1>
                        <input type="email" placeholder="Email" />
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <input type="password" placeholder="Confirm Password" />
                        
                        <div className={styles.terms}>
                            <input type="checkbox" id="terms" />
                            <label htmlFor="terms">You agree to our terms of service</label>
                        </div>
                        <button>Sign Up</button>
                    </form>
                </div>

                {/* Form Đăng Nhập */}
                <div className={`${styles.formContainer} ${styles.signIn}`}>
                    <form>
                        <h1>Sign In</h1>
                        <div className={styles.socialIcons}>
                            <a href="#" className={styles.icon}><FontAwesomeIcon icon={faGooglePlusG} /></a>
                            <a href="#" className={styles.icon}><FontAwesomeIcon icon={faFacebookF} /></a>
                            <a href="#" className={styles.icon}><FontAwesomeIcon icon={faGithub} /></a>
                            <a href="#" className={styles.icon}><FontAwesomeIcon icon={faLinkedinIn} /></a>
                        </div>
                        <span>or use your email password</span>
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <a href="#">Forget Your Password?</a>
                        <button>Sign In</button>
                    </form>
                </div>

                {/* Phần Overlay trượt qua lại */}
                <div className={styles.toggleContainer}>
                    <div className={styles.toggle}>
                        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
                            <h1>Welcome Back!</h1>
                          
                            {/* Dùng hàm navigate mới */}
                            <button className={styles.hidden} onClick={handleLoginClick}>Sign In</button>
                        </div>
                        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
                            <h1>Hello, Friend!</h1>
                            {/* Dùng hàm navigate mới */}
                            <button className={styles.hidden} onClick={handleRegisterClick}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;