import React from 'react';
import ListSearchBar from './components/ListSearchBar'; // Đường dẫn import tùy cấu trúc folder của bạn
import TopListsSection from './components/TopListsSection';
import './AnimeListSearchPage.css';

// --- MOCK DATA (Dữ liệu giả để test giao diện) ---
const MOCK_TOP_LISTS = [
  {
    id: 1,
    title: "Top 10 Emotional Damage Anime",
    username: "SadBoy99",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    likes: 1205,
    count: 10,
    coverImages: [
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21519-Xn35Y17Wd2Y3.png", // Kimi no Na wa
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9989-q1L3Y3F4Wj3N.png", // Anohana
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx17074-D7h2z3q4Wj9N.jpg"  // A Silent Voice (Ví dụ)
    ]
  },
  {
    id: 2,
    title: "Must Watch Isekai 2024",
    username: "IsekaiKing",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    likes: 890,
    count: 25,
    coverImages: [
       "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx142838-ECF5C64C5.jpg",
       "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx153518-7F5C64C5.jpg",
       "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx108465-B9F5C64C5.jpg"
    ]
  },
  {
    id: 3,
    title: "Ghibli Masterpieces",
    username: "StudioFan",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    likes: 3400,
    count: 12,
    coverImages: [
       "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx199-9F5C64C5.jpg",
       "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx129-9F5C64C5.jpg",
       "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx523-9F5C64C5.jpg"
    ]
  },
  // Thêm data giả để test grid
  { id: 4, title: "Chill Slice of Life", username: "CozyVibes", likes: 560, count: 15, userAvatar: "https://i.pravatar.cc/150?img=8", coverImages: ["https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21659-9F5C64C5.jpg", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx10165-9F5C64C5.jpg", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20954-9F5C64C5.jpg"] },
];

const AnimeListSearchPage = () => {
  const handleSearch = (keyword) => {
    console.log("Searching for lists:", keyword);
  };

  return (
    <div className="anime-list-search-page">
      {/* Header / Hero Section (Optional - Có thể tái sử dụng HeroSection nếu muốn) */}
      <div className="list-page-header container">
        <h1>Discover Anime Lists</h1>
        <p>Curated collections from the community</p>
      </div>

      {/* Thanh Search */}
      <ListSearchBar onSearch={handleSearch} />

      {/* Top Lists Section */}
      <div className="page-content">
        <TopListsSection title="Top Liked Lists" lists={MOCK_TOP_LISTS} />
        

      </div>
    </div>
  );
};

export default AnimeListSearchPage;