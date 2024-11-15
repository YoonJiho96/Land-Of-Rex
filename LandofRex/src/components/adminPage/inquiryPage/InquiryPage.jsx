import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import "./InquiryPage.css";
import getFaqList from '../../../apis/apiFaqList';

const InquiryPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("문의내역");
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate(); // useNavigate 추가

  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage]);

  const fetchInquiries = async (page) => {
    try {
      const response = await getFaqList(page - 1, 10);
      const { generalPosts = [], totalPages = 1 } = response;
      setInquiries(generalPosts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("문의내역을 불러오는데 실패했습니다:", error);
      setInquiries([]);
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

  const handleRowClick = (id) => {
    navigate(`/posts/${id}`); // PostDetailPage로 이동
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
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => handleRowClick(inquiry.id)} // 행 클릭 시 이동
                    style={{ cursor: "pointer" }}
                  >
                    <td>{inquiry.id}</td>
                    <td>{getPostTypeName(inquiry.postType)}</td>
                    <td>{inquiry.title}</td>
                    <td>{inquiry.authorNickname || "알 수 없음"}</td>
                    <td>{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                    <td>{inquiry.inquiryStatus?.status || "상태 없음"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
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
