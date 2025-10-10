// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import AnimeDetailPage from './pages/AnimeDetailPage'; // Sẽ tạo ở bước sau
import CalendarPage from './pages/CalendarPage';
import { Link } from 'react-router-dom'; // Import Link
import AuthPage from './components/AuthPage';




function App() {
  return (
    <Router>
      <div className="App">
        {/* Header có thể đặt ở đây nếu muốn nó hiển thị trên mọi trang */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:animeId" element={<AnimeDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;