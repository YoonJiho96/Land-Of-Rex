import React, { useState, useEffect } from 'react';
import './NoticeSection.css';
import fetchNoticeList from '../../../apis/apiNoticeList';
import NoticeDetailPage from '../../noticeDetailPage/NoticeDetailPage';

const NoticesSection = React.forwardRef((props, ref) => {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태

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

  const handleNoticeClick = (noticeId) => {
    setSelectedNoticeId(noticeId);
    setIsModalOpen(true);

    // 모달이 열린 후에 애니메이션 적용
    setTimeout(() => {
      setIsAnimating(true);
    }, 10); // 짧은 지연으로 애니메이션이 바로 적용되게 함
  };

  const closeModal = () => {
    // 닫을 때 애니메이션 해제
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedNoticeId(null);
    }, 400); // 애니메이션 시간과 맞추기
  };

  // 순환하는 prevIndex와 nextIndex 계산
  const prevIndex = (currentIndex - 1 + notices.length) % notices.length;
  const nextIndex = (currentIndex + 1) % notices.length;

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section ref={ref} className="notices-section">
      <div className="notices-content">
        <h2>공지사항</h2>
        <div className="slider-container">
          <button className="slider-button left" onClick={() => setCurrentIndex(prevIndex)}>‹</button>
          
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

          <button className="slider-button right" onClick={() => setCurrentIndex(nextIndex)}>›</button>
        </div>
      </div>

      {/* NoticeDetailPage 모달로 표시 */}
      {isModalOpen && (
        <div className={`modal-overlay ${isAnimating ? 'show' : ''}`} onClick={closeModal}>
          <div className={`modal-content ${isAnimating ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
            <NoticeDetailPage noticeId={selectedNoticeId} onClose={closeModal} />
          </div>
        </div>
      )}
    </section>
  );
});

export default NoticesSection;
