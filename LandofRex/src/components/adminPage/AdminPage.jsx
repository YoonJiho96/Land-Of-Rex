import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar"; // Sidebar import
import "./AdminPage.css"; // AdminPage 전용 CSS 파일

const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("");

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>관리자 페이지</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
