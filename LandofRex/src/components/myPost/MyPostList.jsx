import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../navBar/NavBar'; // NavBar를 import
import { baseUrl } from '../../config/url.js';
import '../postListPage/PostList.css';

const MyPostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/v1/my/posts`, {
        params: { page: currentPage, size: 10 },
        withCredentials: true
      });

      const { data } = response;
      setPosts(data.generalPosts || []);
      setTotalPages(data.totalPages || 1);
      setHasNext(data.hasNext || false);
    } catch (error) {
      console.error('내 게시글 목록 조회 실패:', error);
      setPosts([]);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  const handleInquiryClick = () => {
    window.open('/editorPage', '_blank', 'width=700,height=800,left=100,top=100');
  };

  if (isLoading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list-container">
      {/* 상단에 NavBar 추가 */}
      <NavBar activeSection="myPosts" sections={[]} /> 

      <div className="post-header">
        <h1>내가 쓴 문의글</h1>
        <button className="write-button" onClick={handleInquiryClick}>
          문의하기
        </button>
      </div>

      <div className="post-table">
        <table>
          <thead>
            <tr>
              <th width="10%">번호</th>
              <th width="50%">제목</th>
              <th width="15%">작성자</th>
              <th width="15%">등록일</th>
              <th width="10%">처리상태</th>
            </tr>
          </thead>
          <tbody>
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr
                  key={post.id}
                  onClick={() => navigate(`/posts/${post.id}`)}
                  className="post-row"
                >
                  <td>{post.id}</td>
                  <td className="post-title-cell">
                    {post.isPinned && <span className="pinned-badge">공지</span>}
                    {post.title}
                  </td>
                  <td>{post.authorNickname}</td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="status-cell" title={post.inquiryStatus?.message}>
                    {post.inquiryStatus?.status || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">작성한 게시글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {posts && posts.length > 0 && (
        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            이전
          </button>
          {renderPagination()}
          <button
            className="page-button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={!hasNext || currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPostList;
