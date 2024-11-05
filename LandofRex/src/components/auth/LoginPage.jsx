import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form>
        <input type="email" placeholder="이메일" required />
        <input type="password" placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      <div className="signup-link">
        <p>아직 계정이 없으신가요?</p>
        <Link to="/signup">
          <button className="signup-button">회원가입</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
