import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../config/url.js';
import './NoticeList.css';
import NavBar from '../navBar/NavBar'; // NavBar를 import


const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseUrl}/api/v1/notices`, {
        params: {
          page: currentPage,
          size: 10,
          sort: 'createdAt,desc'
        },
        withCredentials: true
      });

      const { data } = response;
      // 실제 API 응답 구조에 맞게 수정
      setNotices(data.notices || []);
      setTotalPages(data.totalPages || 1);
      setHasNext(data.hasNext || false);
      
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error);
      setNotices([]);
      setError('공지사항을 불러오는데 실패했습니다.');
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

  if (isLoading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    
    <div className="notice-list-container">
      <NavBar activeSection="myPosts" sections={[]} /> 
      <div className="notice-header">
        <h1>공지사항</h1>
        
      </div>

      <div className="notice-table">
        <table>
          <thead>
            <tr>
              <th width="10%">번호</th>
              <th width="50%">제목</th>
              <th width="15%">작성자</th>
              <th width="15%">등록일</th>
              <th width="10%">조회수</th>
            </tr>
          </thead>
          <tbody>
            {notices && notices.length > 0 ? (
              notices.map((notice) => (
                <tr
                  key={notice.id}
                  onClick={() => navigate(`/notices/${notice.id}`)}
                  className="notice-row"
                >
                  <td>{notice.id}</td>
                  <td className="notice-title-cell">
                    {notice.isPinned && <span className="pinned-badge">공지</span>}
                    {notice.title}
                  </td>
                  <td>{notice.author?.nickname || '관리자'}</td>
                  <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                  <td>{notice.viewCount || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {notices && notices.length > 0 && (
        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            이전
          </button>
          {renderPagination()}
          <button
            className="page-button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={!hasNext || currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeList;