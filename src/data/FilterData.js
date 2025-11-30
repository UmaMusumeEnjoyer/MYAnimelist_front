// src/filterData.js

// 1. Tạo danh sách Năm (từ năm hiện tại lùi về 2010)
const currentYear = new Date().getFullYear();
const yearsList = [];
for (let i = currentYear; i >= 2010; i--) {
  yearsList.push(i);
}

// 2. Định nghĩa các dữ liệu khác
export const filterData = {
  years: yearsList,
genres: [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Slice of Life",
    "Sci-Fi",
    "Horror",
    "Ecchi",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sports",
    "Supernatural",
    "Thriller"
  ],
  seasons: [
    { label: "Winter", value: "WINTER" },
    { label: "Spring", value: "SPRING" },
    { label: "Summer", value: "SUMMER" },
    { label: "Fall",   value: "FALL" }
  ],

  // Ví dụ: API yêu cầu gửi số (1, 2, 3) thay vì chữ
  formats: [
    { label: "TV Show", value: "tv" },
    { label: "Movie",   value: "movie" },
    { label: "OVA",     value: "ova" }
  ]
};