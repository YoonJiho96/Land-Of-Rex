import React from 'react';
import './NoticeSection.css';

const NoticesSection = React.forwardRef((props, ref) => {
  const notices = [
    { id: 1, title: '신규 업데이트 안내', date: '2024-10-10', description: '게임 개선 및 신규 콘텐츠 추가' },
    { id: 2, title: '정기 점검 예정', date: '2024-10-20', description: '서버 안정성을 위한 정기 점검' },
  ];

  return (
    <section ref={ref} className="notices-section">
      <div className="notices-content">
        <h2>공지사항</h2>
        <ul>
          {notices.map((notice) => (
            <li key={notice.id} className="notice-item">
              <h3>{notice.title}</h3>
              <p className="date">{notice.date}</p>
              <p>{notice.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default NoticesSection;
