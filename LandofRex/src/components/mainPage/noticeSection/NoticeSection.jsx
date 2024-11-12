import React, { useState, useEffect } from 'react';
import './NoticeSection.css';
import fetchNoticeList from '../../../apis/apiNoticeList';
import NoticeDetailModal from '../../noticeDetailPage/NoticeDetailModal';

const NoticesSection = React.forwardRef((props, ref) => {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null); // 모달로 표시할 공지사항 ID

  useEffect(() => {
    const getNotices = async () => {
      try {
        setLoading(true);
        const data = await fetchNoticeList();
        setNotices(data);
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

  // 공지사항 클릭 시 모달 열기
  const handleNoticeClick = (id) => {
    setSelectedNoticeId(id);
  };

  const closeModal = () => {
    setSelectedNoticeId(null);
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
              <div className="notice-item preview" onClick={() => handleNoticeClick(notices[prevIndex].id)}>
                <h3>{notices[prevIndex].title}</h3>
                <p className="date">{notices[prevIndex].createdAt}</p>
              </div>

              <div className="notice-item active" onClick={() => handleNoticeClick(notices[currentIndex].id)}>
                <h3>{notices[currentIndex].title}</h3>
                <p className="date">{notices[currentIndex].createdAt}</p>
              </div>

              <div className="notice-item preview" onClick={() => handleNoticeClick(notices[nextIndex].id)}>
                <h3>{notices[nextIndex].title}</h3>
                <p className="date">{notices[nextIndex].createdAt}</p>
              </div>
            </>
          )}

          <button className="slider-button right" onClick={handleNext}>›</button>
        </div>

        {/* 공지사항이 선택되었을 때 모달 표시 */}
        {selectedNoticeId && <NoticeDetailModal id={selectedNoticeId} onClose={closeModal} />}
      </div>
    </section>
  );
});

export default NoticesSection;
