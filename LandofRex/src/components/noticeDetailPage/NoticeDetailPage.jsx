import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config/url';
import './NoticeDetailPage.css';

const NoticeDetailPage = ({ noticeId, onClose }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = noticeId || paramId; // prop으로 전달된 noticeId를 우선 사용, 없으면 paramId 사용
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("게시글 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        const postResponse = await fetch(`${baseUrl}/api/v1/notices/${id}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!postResponse.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const postData = await postResponse.json();
        setPost(postData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const renderPostContent = () => {
    if (!post?.content) return null;

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = post.content;

    if (post.images) {
      const imgs = contentDiv.getElementsByTagName('img');
      Array.from(imgs).forEach((img, index) => {
        if (post.images[index]) {
          img.src = post.images[index].urlCloud;
        }
      });
    }

    return <div className="content-body" dangerouslySetInnerHTML={{ __html: contentDiv.innerHTML }} />;
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  if (!post) {
    return (
      <div className="notice-detail">
        <h2 className="text-xl">게시글을 찾을 수 없습니다</h2>
        <button onClick={onClose || (() => navigate(-1))} className="back-button">
          닫기
        </button>
      </div>
    );
  }

  return (
    <div className="notice-detail">
      <div className="notice-section">
        <div className="post-content">
          <div className="content-header">{post.title}</div>
          <div className="time-container">
            <span className="notice-day">작성일</span>
            <span className="notice-time">
              {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).replace(/\.$/, '')}
            </span>
          </div>
          {renderPostContent()}
        </div>
      </div>
      <button onClick={onClose || (() => navigate(-1))} className="back-button">
        닫기
      </button>
    </div>
  );
};

export default NoticeDetailPage;
