import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeList.css';

const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = async () => {
    try {
      // API 호출 예시
      // const response = await axios.get(`/api/notices?page=${currentPage}`);
      // setNotices(response.data.notices);
      // setTotalPages(response.data.totalPages);
      
      // 임시 데이터
      setNotices([
        { id: 1, title: '시스템 점검 안내', author: '관리자', createdAt: '2024-03-07', views: 128 },
        { id: 2, title: '개인정보 처리방침 개정 안내', author: '관리자', createdAt: '2024-03-06', views: 256 },
        { id: 3, title: '신규 기능 업데이트 안내', author: '관리자', createdAt: '2024-03-05', views: 512 },
      ]);
      setTotalPages(5);
    } catch (error) {
      console.error('공지사항 목록 조회 실패:', error);
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="notice-list-container">
      <div className="notice-header">
        <h1>공지사항</h1>
        <button
          className="write-button"
          onClick={() => navigate('/admin/notices/create')}
        >
          글쓰기
        </button>
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
            {notices.map((notice) => (
              <tr
                key={notice.id}
                onClick={() => navigate(`/admin/notices/${notice.id}`)}
              >
                <td>{notice.id}</td>
                <td className="notice-title-cell">{notice.title}</td>
                <td>{notice.author}</td>
                <td>{notice.createdAt}</td>
                <td>{notice.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="page-button"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {renderPagination()}
        <button
          className="page-button"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default NoticeList;