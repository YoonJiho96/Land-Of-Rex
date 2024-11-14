import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ selectedMenu, setSelectedMenu }) => {
  const navigate = useNavigate();
  const menuItems = ['공지사항', '사용자 관리', '문의내역'];

  const handleMenuClick = (item) => {
    setSelectedMenu(item);
    
    // 메뉴 항목에 따른 경로 설정
    switch(item) {
      case '공지사항':
        navigate('/dashboardPage');
        break;
      case '사용자 관리':
        navigate('/userManagement');
        break;
      case '문의내역':
        navigate('/inquiryPage');
        break;
      default:
        navigate('/adminPage');
    }
  };

  return (
    <div className="sidebar">
      <div 
        className="header" 
        onClick={() => navigate('/adminPage')}  // 클릭 시 바로 이동
        style={{ cursor: 'pointer' }} // 커서를 pointer로 변경
      >
        관리자 페이지
      </div>
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
