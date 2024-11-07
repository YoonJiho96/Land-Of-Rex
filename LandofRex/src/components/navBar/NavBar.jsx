import React from 'react';
import { Link } from 'react-router-dom'
import './NavBar-new.css';
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';

const NavBar = ({ activeSection, scrollToSection, sections }) => {
  const { isLoggedIn, logout } = useAuth();  // AuthContext 사용
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');  // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <nav className="navbar">
      <div className="logo">E102</div>
      
      <ul className="nav-links">
        {sections.map((section) => (
          <li
            key={section.name}
            onClick={() => scrollToSection(section.ref)}
            className={activeSection === section.name ? 'active' : ''}
          >
            {section.label}
          </li>
        ))}
      </ul>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <button 
            className="login-button" 
            onClick={handleLogout}
          >
            로그아웃
          </button>
        ) : (
          <Link to="/login">
            <button className="login-button">로그인</button>
          </Link>
        )}
      </div>


      <div className="language-options">
        <span>런처 다운로드</span>
      </div>
    </nav>
  );
};

export default NavBar;
