import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsData } from '../../data/newsData';
import './NewsDetail.css';

function NewsDetailPage() {
  const { id } = useParams();
  const newsItem = newsData.find(news => news.id.toString() === id);

  if (!newsItem) {
    return (
      <div className="news-page-container">
        <section className="news-detail-content not-found">
          <h2>Không tìm thấy tin tức</h2>
          <p>Tin tức với ID "{id}" không tồn tại.</p>
          <Link to="/">Quay về trang chủ</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="news-page-container">
      <section className="news-detail-content">

        <div className="news-header-bar">
          <h1>{newsItem.title}</h1>
        </div>

        <div className="news-body">
          <img 
            src={newsItem.img} 
            alt={newsItem.title} 
            className="news-image" 
          />
          
          {/* 1. Render khối nội dung chính như bình thường */}
          <div className="fullContent">
            {newsItem.fullContent.split('\n').map((line, index) => {
              const trimmedLine = line.trim();
              // Bỏ qua các dòng trống
              if (trimmedLine.length > 0) {
                return <p key={index}>{trimmedLine}</p>;
              }
              return null;
            })}
          </div>

          {/* 2. KIỂM TRA VÀ RENDER TRÍCH DẪN ĐẶC BIỆT 
            Toán tử '&&' có nghĩa là: "Nếu vế bên trái (newsItem.featuredQuote)
            là 'true' (tức là không rỗng/null), thì hãy render vế bên phải."
          */}
          {newsItem.featuredQuote && (
            <blockquote className="special-quote">
              {newsItem.featuredQuote}
              {newsItem.quoteAttribution && (
                <span className="attribution">{newsItem.quoteAttribution}</span>
              )}
            </blockquote>
          )}

        </div>
        
        <Link to="/" className="backLink">
          &larr; Quay lại danh sách
        </Link>
      </section>
    </div>
  );
}

export default NewsDetailPage;