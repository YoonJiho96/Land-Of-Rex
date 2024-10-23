import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar"; // Sidebar import
import "./DashboardPage.css";

const dashboardPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("대시보드");

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>대시보드 페이지</h1>
        </div>
      </div>
    </div>
  );
};

export default dashboardPage;
