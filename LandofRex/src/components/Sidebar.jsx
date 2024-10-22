import React from 'react';
import './Sidebar.css'; // Sidebar의 스타일

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const menuItems = ['대시보드', '사용자 관리', '문의내역']; // 메뉴 항목 설정

  const handleMenuClick = (item) => {
    setSelectedMenu(item); // 선택된 메뉴 상태 업데이트
  };

  return (
    <div className="sidebar">
      <div className="header">관리자 페이지</div>
      <div className="menu">
        {menuItems.map((item) => (
          <div
            key={item}
            className={`menu-item ${selectedMenu === item ? 'menu-item-active' : ''}`}
            onClick={() => handleMenuClick(item)}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
