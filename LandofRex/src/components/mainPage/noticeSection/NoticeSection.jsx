import React, { useState, useEffect } from 'react';
import './NoticeSection.css';
import fetchNoticeList from '../../../apis/apiNoticeList'; // API 함수 가져오기

const NoticesSection = React.forwardRef((props, ref) => {
  const [notices, setNotices] = useState([]); // API에서 받아온 공지사항 목록 저장
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  // 공지사항 데이터를 가져오는 함수
  useEffect(() => {
    const getNotices = async () => {
      try {
        setLoading(true);
        const data = await fetchNoticeList(); // API에서 데이터 가져오기
        setNotices(data); // 공지사항 데이터 상태로 설정
      } catch (err) {
        setError('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getNotices();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? notices.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === notices.length - 1 ? 0 : prevIndex + 1));
  };

  const prevIndex = currentIndex === 0 ? notices.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === notices.length - 1 ? 0 : currentIndex + 1;

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section ref={ref} className="notices-section">
      <div className="notices-content">
        <h2>공지사항</h2>
        <div className="slider-container">
          <button className="slider-button left" onClick={handlePrev}>‹</button>
          
          {notices.length > 0 && (
            <>
              <div className="notice-item preview">
                <h3>{notices[prevIndex].title}</h3>
                <p className="date">{notices[prevIndex].createdAt}</p>
              </div>

              <div className="notice-item active">
                <h3>{notices[currentIndex].title}</h3>
                <p className="date">{notices[currentIndex].createdAt}</p>
              </div>

              <div className="notice-item preview">
                <h3>{notices[nextIndex].title}</h3>
                <p className="date">{notices[nextIndex].createdAt}</p>
              </div>
            </>
          )}

          <button className="slider-button right" onClick={handleNext}>›</button>
        </div>
      </div>
    </section>
  );
});

export default NoticesSection;