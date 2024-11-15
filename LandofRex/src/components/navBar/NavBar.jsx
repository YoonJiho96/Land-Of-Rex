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
        <Link to="/"> {/* 로고 클릭 시 메인 페이지로 이동 */}
          <img src={logo} alt="Land Of Rex Logo" className="logo-image" />
          Land Of Rex
        </Link>
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
              <button className="my-posts-button">내 문의글</button>
            </Link>
            <button className="login-button" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="signup-button">회원가입</button>
            </Link>
            <Link to="/login">
              <button className="login-button">로그인</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
