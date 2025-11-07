import React from 'react';
// Import hook useParams từ react-router-dom
import { useParams, Link } from 'react-router-dom';
// Import mảng dữ liệu tin tức của chúng ta
import { newsData } from './newsData';

function NewsDetailPage() {
  // 1. Lấy 'id' từ URL bằng hook useParams
  // Tên 'id' này phải khớp với tên bạn đặt trong Route (ví dụ: path="/news/:id")
  const { id } = useParams();

  // 2. Tìm tin tức trong mảng dựa trên 'id'
  // Lưu ý: useParams luôn trả về 'id' dưới dạng chuỗi (string),
  // nên chúng ta dùng '==' để so sánh lỏng hoặc chuyển đổi kiểu dữ liệu.
  const newsItem = newsData.find(news => news.id.toString() === id);

  // 3. Xử lý trường hợp không tìm thấy tin tức
  if (!newsItem) {
    return (
      <section className="newsDetailSection">
        <h2>Không tìm thấy tin tức</h2>
        <p>Tin tức với ID "{id}" không tồn tại.</p>
        <Link to="/">Quay về trang chủ</Link>
      </section>
    );
  }

  // 4. Hiển thị nội dung chi tiết của tin tức đã tìm thấy
  return (
    <section className="newsDetailSection">
      <h1>{newsItem.title}</h1>
      <img 
        src={newsItem.img} 
        alt={newsItem.title} 
        style={{ maxWidth: '600px', width: '100%', height: 'auto' }} 
      />
      {/* Hiển thị 'fullContent' thay vì 'snippet' */}
      <div className="fullContent">
        {/* Chúng ta dùng nl2br (hoặc CSS) để xuống hàng nếu nội dung có \n */}
        {newsItem.fullContent.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <br />
      <Link to="/" className="backLink">
        &larr; Quay lại danh sách
      </Link>
    </section>
  );
}

export default NewsDetailPage;