import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NoticeDetailPage.css';
import { baseUrl } from '../../config/url';
import { useAuth } from '../../context/AuthContext';

const importanceBadgeStyles = {
  URGENT: {
    backgroundColor: '#dc2626',
    text: '긴급'
  },
  HIGH: {
    backgroundColor: '#f97316',
    text: '중요'
  },
  NORMAL: {
    backgroundColor: '#6b7280',
    text: '일반'
  }
};

const NoticeDetailPage = ({ noticeIdProp, onClose }) => {
  const { noticeId: noticeIdParam } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const noticeId = noticeIdProp || noticeIdParam;

  useEffect(() => {
    const fetchNotice = async () => {
      if (!noticeId) {
        setError("공지사항 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/v1/notices/${noticeId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('공지사항을 불러오는데 실패했습니다.');
        }

        const noticeData = await response.json();
        setNotice(noticeData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [noticeId]);

  const handleEdit = () => {
    navigate(`/notices/${noticeId}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('공지사항을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${baseUrl}/api/v1/notices/${noticeId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('공지사항 삭제에 실패했습니다.');

      navigate('/notices');
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('공지사항 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="container">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <div className="button-wrapper">
          <button onClick={() => navigate('/notices')} className="back-button">
            목록
          </button>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="container">
        <div>공지사항을 찾을 수 없습니다</div>
        <div className="button-wrapper">
          <button onClick={() => navigate('/notices')} className="back-button">
            목록
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 닫기 아이콘 */}
      {onClose && (
        <span className="close-icon" onClick={onClose}>&times;</span>
      )}
      <div className="notice-section">
        {/* 제목 및 날짜 영역 */}
        <div className="notice-header">
          <div className="notice-title-wrapper">
            <span 
              className="notice-badge"
              style={{ backgroundColor: importanceBadgeStyles[notice.importance].backgroundColor }}
            >
              {importanceBadgeStyles[notice.importance].text}
            </span>
            <h1 className="notice-title">{notice.title}</h1>
          </div>
          <span className="notice-date">
            {new Date(notice.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* 관리자 액션 */}
        {isAdmin && (
          <div className="admin-actions">
            <button className="edit-button" onClick={handleEdit}>
              수정
            </button>
            <button className="delete-button" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}

        {/* 내용 */}
        <div className="notice-content">
          <div dangerouslySetInnerHTML={{ __html: notice.content }} />
        </div>

        {/* 목록 버튼 */}
        <div className="back-button-wrapper">
          <button onClick={() => navigate('/notices')} className="back-button">
            목록
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
