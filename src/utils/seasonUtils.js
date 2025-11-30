// src/utils/seasonUtils.js

export const getCurrentSeasonInfo = () => {
  const date = new Date();
  const month = date.getMonth(); // 0 (Jan) -> 11 (Dec)
  const year = date.getFullYear();

  let season = "";

  // Logic: 3 tháng 1 mùa
  if (month >= 0 && month <= 2) season = "WINTER";      // Jan, Feb, Mar
  else if (month >= 3 && month <= 5) season = "SPRING"; // Apr, May, Jun
  else if (month >= 6 && month <= 8) season = "SUMMER"; // Jul, Aug, Sep
  else season = "FALL";                                 // Oct, Nov, Dec

  return { year, season };
};

export const getNextSeasonInfo = () => {
  const { year, season } = getCurrentSeasonInfo();
  
  let nextYear = year;
  let nextSeason = "";

  switch (season) {
    case "WINTER":
      nextSeason = "SPRING";
      break;
    case "SPRING":
      nextSeason = "SUMMER";
      break;
    case "SUMMER":
      nextSeason = "FALL";
      break;
    case "FALL":
      nextSeason = "WINTER";
      nextYear = year + 1; // [ĐÃ SỬA] Xử lý chuyển năm: Fall 2025 -> Winter 2026
      break;
    default:
      nextSeason = "WINTER";
  }

  return { year: nextYear, season: nextSeason };
};