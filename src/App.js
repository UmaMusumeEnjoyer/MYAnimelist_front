// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import các component và trang
import Header from './components/Header'; // Import Header
import HomePage from './pages/HomePage';
import HomePagelogin from './pages/HomePagelogin';
import AnimeDetailPage from './pages/AnimeDetailPage';
import CalendarPage from './pages/CalendarPage';
import AuthPage from './components/AuthPage';
import CharacterPage from './pages/CharacterPage'; // Sửa đường dẫn import
import StaffPage from './pages/StaffPage';
import { AuthProvider } from './context/AuthContext';
import NewsDetailPage from './pages/NewsData/NewsDetailPage';

function App() {
  return (
    <Router>
      {/* Header được đặt ở đây, bên ngoài <Routes>, 
        để nó luôn hiển thị trên mọi trang.
      */}
      <AuthProvider>
      <Header />

      <main>
        {/* Routes chỉ render nội dung của trang tương ứng với URL */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/anime/:animeId" element={<AnimeDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          {/* Route for logged-in home view */}
          <Route path="/homepagelogin" element={<HomePagelogin />} />
          <Route path="/character/:characterId" element={<CharacterPage />} />
          <Route path="/staff/:staffId" element={<StaffPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/terms" element={<NewsDetailPage />} />
          <Route path="/privacy" element={<NewsDetailPage />} />
          <Route path="/contact" element={<NewsDetailPage />} />
          <Route path="/about" element={<NewsDetailPage />} />
          {/* <Route path="/search/:type" element={<SearchPage />} /> */}
        </Routes>
      
      </main>
        </AuthProvider>
    </Router>
  );
}

export default App;