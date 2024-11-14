import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar"; // Sidebar import
import "./DashboardPage.css";
import NoticeList from "../../noticeListPage/NoticeListPage"; // NoticeList 컴포넌트 import
import NoticeCreatePage from "../../noticeCreatePage/NoticeCreatePage"; // NoticeCreatePage 컴포넌트 import

import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate import

const DashboardPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("공지사항");
  const [isCreatingNotice, setIsCreatingNotice] = useState(false);
  const navigate = useNavigate();

  // 공지사항 작성 페이지를 표시하는 함수
  const handleCreateNotice = () => {
    setIsCreatingNotice(true);
  };

  // 공지사항 작성 후 목록으로 돌아가는 함수
  const handleBackToList = () => {
    setIsCreatingNotice(false);
  };
  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>공지사항 페이지</h1>
          {!isCreatingNotice && (
            <button 
              className="create-notice-button" 
              onClick={handleCreateNotice}
            >
              공지사항 작성
            </button>
          )}
        </div>

        {/* 조건에 따라 NoticeList 또는 NoticeCreatePage를 렌더링 */}
        {isCreatingNotice ? (
          <NoticeCreatePage onBack={handleBackToList} />
        ) : (
          <NoticeList />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
