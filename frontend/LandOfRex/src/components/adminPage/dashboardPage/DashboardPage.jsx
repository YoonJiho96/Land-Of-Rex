import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar"; // Sidebar import
import "./DashboardPage.css";
import NoticeList from "../../noticeListPage/NoticeListPage"; // NoticeListPage 컴포넌트 import
import NoticeCreatePage from "../../noticeCreatePage/NoticeCreatePage"; // NoticeCreatePage 컴포넌트 import
import NoticeDetailPage from "../../noticeDetailPage/NoticeDetailPage"; // NoticeDetailPage 컴포넌트 import

const DashboardPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("공지사항");
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null); // 선택된 공지사항 ID 상태

  // 공지사항 작성 페이지를 표시하는 함수
  const handleCreateNotice = () => {
    setIsCreatingNotice(true);
  };

  // 공지사항 작성 후 목록으로 돌아가는 함수
  const handleBackToList = () => {
    setIsCreatingNotice(false);
    setSelectedNoticeId(null); // 상세 페이지에서 돌아오면 선택된 공지 초기화
  };

  // 공지사항 목록에서 항목 클릭 시 상세 페이지 표시
  const handleViewNoticeDetail = (noticeId) => {
    setSelectedNoticeId(noticeId);
    console.log("Selected Notice ID:", noticeId);
  };

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>공지사항 페이지</h1>
          {!isCreatingNotice && !selectedNoticeId && (
            <button
              className="create-notice-button"
              onClick={handleCreateNotice}
            >
              공지사항 작성
            </button>
          )}
        </div>

        {/* 조건에 따라 렌더링 */}
        {isCreatingNotice ? (
          <NoticeCreatePage onBack={handleBackToList} />
        ) : selectedNoticeId ? (
          <NoticeDetailPage
            noticeId={selectedNoticeId} // 선택된 공지 ID를 전달
            onBack={handleBackToList} // 뒤로가기 버튼을 위한 함수 전달
          />
        ) : (
          <NoticeList onViewDetail={handleViewNoticeDetail} /> // 상세 보기 콜백 전달
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
