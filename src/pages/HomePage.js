// src/pages/HomePage.js
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Icosahedron } from '../components/Icosahedron';
import { Link } from 'react-router-dom';

// BƯỚC 1: Import file CSS mới của bạn
import './HomePage.css';

const HomePage = () => {

  return (
    // Sử dụng một div bọc ngoài để chứa cả 2 phần
    <div>
      {/* PHẦN 1: Layout 2 cột (Giữ nguyên inline style vì bạn không yêu cầu đổi) */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'flex-start' }}>

        {/* CỘT BÊN TRÁI: Nội dung Anime */}
        <main style={{ flex: 1, padding: '0 50px' }}>
          <h2>Nội dung chính</h2>
          <p>Đây là khu vực nội dung bên trái của bạn...</p>
          <p>...</p>
        </main>

        {/* CỘT BÊN PHẢI: Khối cầu 3D */}
        <div style={{ flex: 1, height: '90vh', position: 'sticky', top: '20px' }}>
          <Canvas style={{ width: '100%', height: '100%' }}>
            <ambientLight color={0xffffff} intensity={1.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={5.0}
              castShadow
            />
            <directionalLight position={[-10, -10, -5]} intensity={0.3} />

            <Suspense fallback={null}>
              <Icosahedron />
            </Suspense>
          </Canvas>
        </div>

      </div>

      {/* --- PHẦN 2: Khu vực Video Call-to-Action --- */}
      {/* BƯỚC 2: Thay thế 'style={...}' bằng 'className' */}
      <section className="videoSection">

        {/* 1. Lớp Video Background */}
        <video
          className="videoBackground" // <-- Thay đổi ở đây
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/phainon.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ ...
        </video>

        {/* 2. Lớp Overlay (Làm mờ / tối) */}
        <div className="videoOverlay"></div> {/* <-- Thay đổi ở đây */}

        {/* 3. Lớp Nội dung (Text + Button) */}
        <div className="contentContainer"> {/* <-- Thay đổi ở đây */}
          
          {/* Bên trái: Div chứa chữ */}
          <div className="textContainer"> {/* <-- Thay đổi ở đây */}
            
            {/* BƯỚC 3: Xóa inline style cho text (vì đã định nghĩa trong CSS) */}
            <h3>
              Tham gia cộng đồng
            </h3>
            <p>
              Đừng bỏ lỡ những cập nhật mới nhất và các sự kiện độc quyền.
            </p>
          </div>

          {/* Bên phải: Nút Sign Up Now */}
          <div>
            {/* Component <Link> của bạn đã chính xác, không cần sửa */}
            <Link to="/signup" className="signUpButton">Sign Up</Link>
          </div>

        </div>
      </section>
      {/* --- Hết Phần 2 --- */}

    </div>
  );
};

// BƯỚC 4: Xóa toàn bộ object 'styles' này đi.
// const styles = {
//   ...
// };

export default HomePage;