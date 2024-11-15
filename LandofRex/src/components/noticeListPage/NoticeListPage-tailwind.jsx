import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../config/url.js';

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
          className={`px-3 py-2 mx-1 rounded ${
            currentPage === i 
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-600">로딩 중...</div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-red-600">{error}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">번호</th>
              <th className="w-[50%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록일</th>
              <th className="w-[10%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notices && notices.length > 0 ? (
              notices.map((notice) => (
                <tr
                  key={notice.id}
                  onClick={() => navigate(`/notices/${notice.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notice.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notice.isPinned && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        공지
                      </span>
                    )}
                    {notice.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notice.author?.nickname || '관리자'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {notice.viewCount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {notices && notices.length > 0 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            className={`px-4 py-2 rounded ${
              currentPage === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            이전
          </button>
          {renderPagination()}
          <button
            className={`px-4 py-2 rounded ${
              !hasNext || currentPage === totalPages - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
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