import React, { useState } from 'react';
import './NoticeSection.css';

const NoticesSection = React.forwardRef((props, ref) => {
  const notices = [
    { id: 1, title: '신규 업데이트 안내', date: '2024-10-10', description: '게임 개선 및 신규 콘텐츠 추가' },
    { id: 2, title: '정기 점검 예정', date: '2024-10-20', description: '서버 안정성을 위한 정기 점검' },
    { id: 3, title: '이벤트 공지', date: '2024-11-01', description: '연말 이벤트 안내' },
    { id: 4, title: '긴급 서버 점검 완료', date: '2024-11-05', description: '서버 안정화 완료' },
    { id: 5, title: '신규 캐릭터 출시', date: '2024-11-10', description: '새로운 캐릭터가 추가되었습니다.' },
    { id: 6, title: '신규 맵 추가', date: '2024-11-15', description: '새로운 맵이 추가되었습니다.' },
    { id: 7, title: '버그 수정 안내', date: '2024-11-20', description: '몇 가지 알려진 버그가 수정되었습니다.' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? notices.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === notices.length - 1 ? 0 : prevIndex + 1));
  };

  const prevIndex = currentIndex === 0 ? notices.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === notices.length - 1 ? 0 : currentIndex + 1;

  return (
    <section ref={ref} className="notices-section">
      <div className="notices-content">
        <h2>공지사항</h2>
        <div className="slider-container">
          <button className="slider-button left" onClick={handlePrev}>‹</button>
          
          <div className="notice-item preview">
            <h3>{notices[prevIndex].title}</h3>
          </div>
          
          <div className="notice-item active">
            <h3>{notices[currentIndex].title}</h3>
            <p className="date">{notices[currentIndex].date}</p>
            <p>{notices[currentIndex].description}</p>
          </div>

          <div className="notice-item preview">
            <h3>{notices[nextIndex].title}</h3>
          </div>
          
          <button className="slider-button right" onClick={handleNext}>›</button>
        </div>
      </div>
    </section>
  );
});

export default NoticesSection;
