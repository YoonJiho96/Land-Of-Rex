// PostDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetailPage.css';
import { baseUrl } from '../../config/url';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import axios from 'axios';


// 댓글 입력 컴포넌트
const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await fetch(`/api/v1/posts/${postId}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('댓글 작성에 실패했습니다.');

      const newComment = await response.json();
      onCommentAdded(newComment);
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답글을 입력하세요"
        className="comment-input"
      />
      <button type="submit" className="comment-submit">답글 작성</button>
    </form>
  );
};

// 댓글 목록 컴포넌트
const CommentList = ({ comments }) => {
  return (
    <div className="comments-list">
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <div className="comment-header">
            <span className="comment-author">{comment.authorNickname}</span>
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="comment-content">{comment.content}</div>
        </div>
      ))}
    </div>
  );
};

// 메인 페이지 컴포넌트
const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user,isAuthor } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 게시글과 댓글 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) {
        setError("게시글 ID가 없습니다.");
        setIsLoading(false);
        return;
      }

      try {
        // 게시글 데이터 fetch
        const postResponse = await fetch(`${baseUrl}/api/v1/posts/${postId}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        // 댓글 데이터 fetch
        const commentsResponse = await fetch(`${baseUrl}/api/v1/posts/${postId}/comments`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!postResponse.ok || !commentsResponse.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const postData = await postResponse.json();
        const commentsData = await commentsResponse.json();

        setPost(postData);
        setComments(commentsData);

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // 게시글 내용 렌더링
  const renderPostContent = () => {
    if (!post?.content) return null;

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = post.content;

    if (post.images && post.images.length > 0) {
        // seq 기준으로 이미지 정렬
        const sortedImages = [...post.images].sort((a, b) => a.seq - b.seq);
        const imgs = contentDiv.getElementsByTagName('img');
        
        Array.from(imgs).forEach((img, index) => {
            // index에 해당하는 seq를 가진 이미지 찾기
            const matchingImage = sortedImages.find(image => image.seq === index);
            if (matchingImage) {
                img.src = matchingImage.urlCloud;
                // 필요한 경우 이미지 스타일 추가
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }

    return <div dangerouslySetInnerHTML={{ __html: contentDiv.innerHTML }} />;
  };

  // 새 댓글 추가 핸들러
  const handleCommentAdded = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            목록
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <h2 className="text-xl">게시글을 찾을 수 없습니다</h2>
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          목록
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    window.location.href = `${baseUrl}/posts/${post.id}/edit`;
  };

  // 게시글 삭제 핸들러
  const handleDelete = async () => {
    Swal.fire({
      title: '게시글을 삭제하시겠습니까?',
      text: "삭제된 게시글은 복구할 수 없습니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios({
            method: 'DELETE',
            url: `${baseUrl}/api/v1/posts/${postId}`,
            withCredentials: true,
          });

          Swal.fire(
            '삭제 완료!',
            '게시물이 성공적으로 삭제되었습니다.',
            'success'
          ).then(() => {
            navigate('/my/posts'); // 삭제 후 "/my/posts" 경로로 이동
          });
        } catch (error) {
          console.error('Error deleting post:', error);
          Swal.fire('오류', '게시글 삭제에 실패했습니다.', 'error');
        }
      }
    });
  };



  return (
    <div className="container">
      {/* 게시글 섹션 */}
      <div className="post-section">
        <div className="post-title-section">
          <h1 className="post-title">{post.title}</h1>
        </div>
        
        <div className="post-meta">
          <div className="meta-item">
            <span className="meta-label">작성자</span>
            <span className="meta-value">{post.authorNickname}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">상태</span>
            <span 
              className="meta-value status-tooltip"
              title={post.inquiryStatus?.message}
            >
              {post.inquiryStatus?.status || '-'}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">작성일</span>
            <span className="meta-value">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="post-content">
          <div className="content-header">
            <span className="content-title">게시글 내용</span>
            {isAuthor(post.authorNickname) && (
              <div className="author-actions">
                <button className="edit-button" onClick={handleEdit}>
                  수정
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  삭제
                </button>
              </div>
            )}
          </div>
          <div className="content-body">
            {renderPostContent()}
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="comments-section">
        <h2 className="comments-title">답글</h2>
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
        <CommentList comments={comments} />
      </div>
      <div className="back-button-container">

      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        목록
      </button>
    </div>
    </div>

  );
};

export default PostDetailPage;