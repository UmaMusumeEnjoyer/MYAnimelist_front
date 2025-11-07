// src/newsData.js

// Mảng dữ liệu chứa 3 tin tức mẫu
export const newsData = [
  {
    id: 1,
    title: "Tin Tức 1: ReactJS là gì?",
    img: "/images/react-logo.png", // Đường dẫn đến ảnh
    snippet: "ReactJS là một thư viện JavaScript phổ biến...",
    // Thêm nội dung đầy đủ cho trang chi tiết
    fullContent: `ReactJS là một thư viện JavaScript linh hoạt và hiệu quả để xây dựng giao diện người dùng. 
                  Nó cho phép bạn tạo ra các thành phần UI có thể tái sử dụng và quản lý trạng thái (state) 
                  một cách hiệu quả. React được phát triển và duy trì bởi Facebook.`
  },
  {
    id: 2,
    title: "Tin Tức 2: Giới thiệu về CSS Grid",
    img: "/images/css-grid.png",
    snippet: "CSS Grid Layout là một hệ thống bố cục mạnh mẽ...",
    fullContent: `CSS Grid Layout là một hệ thống bố cục hai chiều cho CSS, cho phép bạn thiết kế các 
                  giao diện web phức tạp một cách dễ dàng. Bạn có thể kiểm soát cả hàng và cột, 
                  tạo ra các thiết kế linh hoạt mà không cần đến float hay positioning.`
  },
  {
    id: 3,
    title: "Tin Tức 3: Tìm hiểu về ES6 Modules",
    img: "/images/es6-logo.png",
    snippet: "ES6 (ECMAScript 2015) đã giới thiệu hệ thống module...",
    fullContent: `Trước ES6, JavaScript không có cú pháp chuẩn để nhập (import) và xuất (export) 
                  các modules. ES6 đã giải quyết vấn đề này, cho phép các nhà phát triển 
                  tổ chức code của họ thành các tệp nhỏ, có thể tái sử dụng.`
  }
];