import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar-new.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.ico'; // logo.ico 파일을 import

const NavBar = ({ activeSection, scrollToSection, sections }) => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Land Of Rex Logo" className="logo-image" /> {/* 로고 이미지 추가 */}
        Land Of Rex
      </div>

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
          <>
            <Link to="/my/posts">
              <button className="my-posts-button">내 게시글</button>
            </Link>
            <button className="login-button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="login-button">로그인</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
