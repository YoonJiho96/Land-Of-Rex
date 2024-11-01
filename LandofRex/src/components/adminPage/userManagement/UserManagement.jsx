import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar"; // Sidebar import
import "./UserManagement.css"; // AdminPage 전용 CSS 파일

const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("사용자 관리");

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>사용자 관리 페이지</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
