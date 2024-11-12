import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fetchNoticeDetail from '../../apis/apiNoticeDetail';
import './NoticeDetailPage.css';

const NoticeDetailPage = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getNoticeDetail = async () => {
      try {
        const data = await fetchNoticeDetail(id);
        setNotice(data);
      } catch (err) {
        setError('공지사항 세부 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getNoticeDetail();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="notice-detail">
      <h2>{notice.title}</h2>
      <p>{notice.createdAt}</p>
      <p>{notice.content}</p>
    </div>
  );
};

export default NoticeDetailPage;
