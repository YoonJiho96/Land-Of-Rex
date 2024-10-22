import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar"; // Sidebar import
import "./AdminPage.css"; // AdminPage 전용 CSS 파일

const AdminPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("대시보드");

  // 더미 데이터
  const [adminData, setAdminData] = useState([]); // 관리자 관련 데이터 상태

  // 더미 데이터 로딩을 위한 효과
  useEffect(() => {
    // 실제 API 호출로 교체할 수 있는 부분
    const fetchAdminData = () => {
      // 더미 데이터 생성
      const dummyData = [
        { id: 1, name: "사용자 A", email: "userA@example.com" },
        { id: 2, name: "사용자 B", email: "userB@example.com" },
        { id: 3, name: "사용자 C", email: "userC@example.com" },
      ];
      setAdminData(dummyData); // 더미 데이터를 상태에 설정
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>관리자 페이지</h1>
        </div>
        
        {/* 관리자의 사용자 목록 */}
        <div className="admin-user-list">
          <h2>사용자 목록</h2>
          {adminData.length > 0 ? (
            <ul>
              {adminData.map(user => (
                <li key={user.id}>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>등록된 사용자가 없습니다.</p>
          )}
        </div>

        {/* 추가적인 관리 기능을 위한 공간 */}
        <div className="admin-functions">
          <button className="admin-function-button">
            사용자 관리
          </button>
          <button className="admin-function-button">
            문의내역
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
