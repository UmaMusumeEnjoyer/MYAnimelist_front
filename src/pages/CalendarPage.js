// src/pages/CalendarPage.js
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import CSS cho lịch
import Header from '../components/Header';
import './CalendarPage.css';

// Thiết lập localizer để lịch biết cách xử lý ngày tháng
const localizer = momentLocalizer(moment);

// Dữ liệu sự kiện mẫu
const myEventsList = [
  // Tuần 1
  {
    title: '3pm 元祖！バンドリちゃん',
    start: new Date(2025, 9, 2, 15, 0, 0),
    end: new Date(2025, 9, 2, 15, 0, 0),
    color: '#03A9F4'
  },
  {
    title: '8pm 不都合な恋曲',
    start: new Date(2025, 9, 2, 20, 0, 0),
    end: new Date(2025, 9, 2, 20, 0, 0),
    color: '#03A9F4'
  },
  {
    title: '9:30pm 私を喰べたい、ひとでなし',
    start: new Date(2025, 9, 2, 21, 30, 0),
    end: new Date(2025, 9, 2, 21, 30, 0),
    color: '#03A9F4'
  },
  {
    title: '7pm 間に合わない岩田さんと間に合う...',
    start: new Date(2025, 9, 4, 19, 0, 0),
    end: new Date(2025, 9, 4, 19, 0, 0),
    color: '#03A9F4'
  },
  {
    title: '8:45pm 終末ツーリング',
    start: new Date(2025, 9, 4, 20, 45, 0),
    end: new Date(2025, 9, 4, 20, 45, 0),
    color: '#03A9F4'
  },
  {
    title: '11:30pm 友達の妹が俺にだけウザい',
    start: new Date(2025, 9, 4, 23, 30, 0),
    end: new Date(2025, 9, 4, 23, 30, 0),
    color: '#03A9F4'
  },
  {
    title: '3pm 噂のオーケストラ後編',
    start: new Date(2025, 9, 5, 15, 0, 0),
    end: new Date(2025, 9, 5, 15, 0, 0),
    color: '#03A9F4'
  },
  
  // Tuần 2
  {
    title: '7:30pm 天穂のサクナヒメです。',
    start: new Date(2025, 9, 6, 19, 30, 0),
    end: new Date(2025, 9, 6, 19, 30, 0),
    color: '#03A9F4'
  },
  {
    title: '12am 千歳くんはラムネ瓶のなか',
    start: new Date(2025, 9, 7, 0, 0, 0),
    end: new Date(2025, 9, 7, 0, 0, 0),
    color: '#03A9F4'
  },
  {
    title: '9:45pm ワンダンス',
    start: new Date(2025, 9, 8, 21, 45, 0),
    end: new Date(2025, 9, 8, 21, 45, 0),
    color: '#03A9F4'
  },
  
  // Tuần 3
  {
    title: 'ウマ娘 e-event https://live.nulla.top/S2',
    allDay: true, // Đánh dấu đây là sự kiện cả ngày
    start: new Date(2025, 9, 18),
    end: new Date(2025, 9, 18),
    color: '#0277bd'
  }
];

const CustomEvent = ({ event }) => {
  return (
    <div className="custom-event">
      <span className="event-dot" style={{ backgroundColor: event.color }}></span>
      <span className="event-title">{event.title}</span>
    </div>
  );
};

const CalendarPage = () => {
  return (
    <div>
      
      <div style={{ height: '85vh', padding: '20px' }}> {/* Đặt chiều cao cho lịch */}
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
                      // Sử dụng component tùy chỉnh
            components={{
              event: CustomEvent, // Áp dụng cho các sự kiện trong ô ngày
            }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;