import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import "./InquiryPage.css";
import getFaqList from '../../../apis/apiFaqList';
import axios from 'axios';
import apiSaveStatus from "../../../apis/apiSaveStatus";
import { baseUrl } from '../../../config/url';
import Swal from 'sweetalert2';


const STATUS_OPTIONS = {
  "미확인": "미확인",
  "확인": "확인",
  "처리중": "처리중",
  "해결": "해결",
  "반려": "반려"
};

const STATUS_MAP = {
  "미확인": "UNCHECKED",
  "확인": "CHECKED",
  "처리중": "IN_PROGRESS",
  "해결": "RESOLVED",
  "반려": "REJECTED"
};

const InquiryPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("문의내역");
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0); // 전체 게시글 수를 저장할 state 추가
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage]);

  const fetchInquiries = async (page) => {
    try {
      const response = await getFaqList(page - 1, 10);
      const { generalPosts = [], totalPages = 1, totalElements = 0 } = response;
      setInquiries(generalPosts);
      setTotalPages(totalPages);
      setTotalElements(totalElements); // 전체 게시글 수 설정
      
      // 초기 상태값 설정
      const initialStatuses = {};
      generalPosts.forEach(inquiry => {
        initialStatuses[inquiry.id] = inquiry.inquiryStatus?.status || "미확인";
      });
      setSelectedStatuses(initialStatuses);
    } catch (error) {
      console.error("문의내역을 불러오는데 실패했습니다:", error);
      setInquiries([]);
    }
  };

  const getDisplayNumber = (index) => {
    // 전체 게시글 수에서 현재 페이지와 인덱스를 이용하여 번호 계산
    return totalElements - ((currentPage - 1) * 10 + index);
  };

  const handleStatusChange = (inquiryId, newStatus) => {
    setSelectedStatuses(prev => ({
      ...prev,
      [inquiryId]: newStatus
    }));
  };


  const handleSave = async (inquiryId) => {
    try {
      const newStatus = selectedStatuses[inquiryId];
      const englishStatus = STATUS_MAP[newStatus];
  
      const response = await apiSaveStatus(inquiryId, englishStatus);
  
      Swal.fire({
        title: "저장 완료!",
        text: "상태가 성공적으로 저장되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
  
      fetchInquiries(currentPage); // 데이터 새로고침
    } catch (error) {
      console.error("상태 업데이트 실패:", error.response?.data || error.message);
  
      Swal.fire({
        title: "저장 실패",
        text: "상태 변경에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };    
  const getPostTypeName = (postType) => {
    switch (postType) {
      case "GAME_FEEDBACK":
        return "게임 피드백";
      case "ACCOUNT_ISSUE":
        return "계정 문제";
      case "SUGGESTION":
        return "건의 사항";
      case "BUG_REPORT":
        return "버그 사항";
      default:
        return "기타";
    }
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const handleRowClick = (id, event) => {
    if (!event.target.closest('.status-cell')) {
      navigate(`/posts/${id}`);
    }
  };

  const getCurrentStatus = (inquiry) => {
    return inquiry.inquiryStatus?.status || "미확인";
  };

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>문의내역</h1>
        </div>

        <div className="inquiry-table-container">
          <table className="inquiry-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>유형</th>
                <th>제목</th>
                <th>작성자</th>
                <th>날짜</th>
                <th>상태</th>
                <th>저장</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry.id}
                    onClick={(e) => handleRowClick(inquiry.id, e)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{getDisplayNumber(index)}</td>
                    <td>{getPostTypeName(inquiry.postType)}</td>
                    <td>{inquiry.title}</td>
                    <td>{inquiry.authorNickname || "알 수 없음"}</td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td className="status-cell">
                      <select
                        value={selectedStatuses[inquiry.id] || getCurrentStatus(inquiry)}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className="status-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="status-cell">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(inquiry.id);
                        }}
                        className="save-button"
                      >
                        저장
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    문의내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          {renderPagination()}
          <button
            className="page-button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;