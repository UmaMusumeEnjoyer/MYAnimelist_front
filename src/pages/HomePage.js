// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

import './HomePage.css';

const HomePage = () => {

  // Dữ liệu giả (placeholder) cho các section bên dưới
  const trendingAnime = [
    { id: 1, title: 'This Monster Wants to Eat Me', img: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx183385-f1TgnttLckBT.jpg', desc: '“I’ve come to eat you.” So softly utters the mermaid...' },
    { id: 2, title: 'Adachi and Shimamura', img: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx109287-yHDlERSIEjsL.jpg', desc: 'Adachi spends her school days skipping class until she meets fellow delinquent ...' },
    { id: 3, title: 'Laid-Back Camp', img: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx98444-Vzysp1EsrzgD.jpg', desc: 'Rin likes to go camping by herself along the lakes that provide a scenic view of Mt. Fuji...' },
    { id: 4, title: 'Super Cub', img: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113418-OjWcmCXAHWkq.jpg', desc: 'There’s freedom in loneliness, and Koguma finds hers on a motorcycle. A Honda Super...' },
  ];

  const genres = ['Shonen', 'Isekai', 'Slice of Life', 'Sci-Fi', 'Fantasy', 'Yuri'];

  const latestNews = [
    { id: 1, title: 'New "One Piece" Movie Announced!', img: '/images/op-news.jpg', snippet: 'Toei Animation has just revealed the next blockbuster movie...' },
    { id: 2, title: 'Season 3 of "Demon Slayer" Breaks Records', img: '/images/ds-news.jpg', snippet: 'The latest season has surpassed all streaming expectations...' },
    { id: 3, title: 'Frieren Wins "Anime of the Year"', img: '/images/frieren-news.jpg', snippet: 'The beloved fantasy anime takes home the grand prize...' },
  ];


  return (
    <div className="homePage">

      {/* --- PHẦN MỚI 1: Hero Section (Giống như ảnh bạn cung cấp) --- */}
      <section className="heroSection">
        <div className="heroContent">
          <h1>Manage <br /> Your Anime <br /> Journey</h1> {/* Tiêu đề bạn có thể thay đổi */}
          <p>From the latest series to the classics. Search, follow. Never lose your way in your watching list again.</p> {/* Mô tả bạn có thể thay đổi */}

        </div>
        <div className="heroImage">
          {/* Đây là nơi bạn sẽ chèn ảnh thống kê. */}
          {/* Thay thế '/images/hero-dashboard.png' bằng đường dẫn ảnh của bạn */}
          <img src="/images/dashboard.png" alt="Dashboard statistics" />
        </div>
      </section>
      {/* --- Hết PHẦN MỚI 1 --- */}


      {/* --- PHẦN MỚI 3: Features Section --- */}
      <section className="featuresSection">
        <div className="featuresTextContent">
          <span className="featuresLabel">OUR FEATURES</span>
          <h2>How our data will help your <br /> day to day Anime</h2>
          <p className="featuresIntro">Get ready for an extraordinary journey into the world of Anime.</p>

          <div className="featureItem">
            <div className="featureIcon">
              <i className="fas fa-shield-alt"></i> {/* Icon cho Data Security */}
            </div>
            <div className="featureDetails">
              <h3>Endless Exploration</h3>
              <p>Finding your next series has never been easier. Our detailed filters allow you to delve into our vast library by genre, rating, or studio. From blockbuster hits to hidden gems, your next adventure is just a click away.</p>
            </div>
          </div>

          <div className="featureItem">
            <div className="featureIcon">
              <i className="fas fa-chart-line"></i> {/* Icon cho Analytics */}
            </div>
            <div className="featureDetails">
              <h3>Analytics</h3>
              <p>Receive detailed information about your anime viewing journey. Discover how much time you've spent watching, which genres you watch the most, and your average rating.</p>
            </div>
          </div>
          {/* Bạn có thể thêm nhiều featureItem khác nếu cần */}
        </div>
        <div className="featuresImage">
          {/* Đây là nơi bạn sẽ chèn ảnh laptop thống kê. */}
          {/* Thay thế '/images/features-laptop.png' bằng đường dẫn ảnh của bạn */}
          <img src="/images/laptop-dashboard.png" alt="Laptop showing data analytics" />
        </div>
      </section>
      {/* --- Hết PHẦN MỚI 3 --- */}


      {/* --- PHẦN 1 CŨ: Video Call-to-Action (Code của bạn) --- */}
      <section className="videoSection">
        <video
          className="videoBackground"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/phainonH264.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
        <div className="videoOverlay"></div>
        <div className="contentContainer">
          <div className="textContainer">
            <h3>Connecting Communities</h3>
            <p>Don't miss out on information about upcoming series, new broadcast schedules, and join in lively discussions about the anime trends of the season.</p>
          </div>
          <div>
            <Link to="/signup" className="signUpButton">Sign Up</Link>
          </div>
        </div>
      </section>
      {/* --- Hết Phần 1 CŨ --- */}

      {/* --- CÁC PHẦN KHÁC (TRENDING, GENRE, NEWS, FOOTER) CỦA BẠN SẼ NẰM Ở ĐÂY --- */}
      {/* ... (Các section trendingSection, genreSection, latestNewsSection, footer) ... */}

       {/* --- PHẦN 2: Trending Now Section --- */}
       <section className="trendingSection">
        <h2>Popular This Season</h2>
        <div className="animeGrid">
          {trendingAnime.map(anime => (
            <Link to={`/anime/${anime.id}`} key={anime.id} className="animeCard">
              <img src={anime.img} alt={anime.title} />
              <div className="cardContent">
                <h3>{anime.title}</h3>
                <p>{anime.desc}</p>
                <span className="cardButton">Learn More</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* --- Hết Phần 2 --- */}


      {/* --- PHẦN 3: Explore by Genre Section --- */}
      <section className="genreSection">
        <h2>Explore by Genre</h2>
        <div className="genreChips">
          {genres.map(genre => (
            <Link to={`/genre/${genre.toLowerCase()}`} key={genre} className="genreChip">
              {genre}
            </Link>
          ))}
        </div>
      </section>
      {/* --- Hết Phần 3 --- */}


      {/* --- PHẦN 4: Latest News Section --- */}
      <section className="latestNewsSection">
        <h2>Latest News</h2>
        <div className="newsGrid">
          {latestNews.map(news => (
            <article key={news.id} className="newsArticle">
              <img src={news.img} alt={news.title} />
              <div className="newsContent">
                <h4>{news.title}</h4>
                <p>{news.snippet}</p>
                <Link to={`/news/${news.id}`} className="readMoreLink">
                  Read More &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* --- Hết Phần 4 --- */}


      {/* --- PHẦN 5: Footer --- */}
      <footer className="footer">
        <div className="footerLinks">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <p>&copy; 2025 MyAnilist Site. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default HomePage;