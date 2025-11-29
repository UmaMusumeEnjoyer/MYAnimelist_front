// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import các component và trang
import Header from './components/Header'; // Import Header
import HomePage from './pages/HomePage/HomePage';
import HomePagelogin from './pages/HomePageLogin/HomePagelogin';
import AnimeDetailPage from './pages/AnimeDetailPage/AnimeDetailPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import AuthPage from './pages/AuthPage/AuthPage';
import CharacterPage from './pages/CharacterPage/CharacterPage'; // Sửa đường dẫn import
import StaffPage from './pages/StaffPage/StaffPage';
import { AuthProvider } from './context/AuthContext';
import NewsDetailPage from './pages/NewsDetailPage/NewsDetailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AnimeSearchPage from './pages/AnimeSearch/AnimeSearchPage';
import AnimeListPage from './pages/AnimeListPage/AnimeListPage';

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/browse" element={<AnimeSearchPage />} />

          <Route path="/list" element={<AnimeListPage />} />
          {/* <Route path="/search/:type" element={<SearchPage />} /> */}
        </Routes>
      
      </main>
        </AuthProvider>
    </Router>
  );
}

export default App;