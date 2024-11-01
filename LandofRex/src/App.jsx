import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import MainPage from './components/mainPage/MainPage';
import AdminPage from './components/adminPage/AdminPage';
import InquiryPage from './components/adminPage/inquiryPage/InquiryPage';
import UserManagement from './components/adminPage/userManagement/UserManagement';
import DashboardPage from './components/adminPage/dashboardPage/DashboardPage';
import SignupPage from './components/auth/SignupPage';
import LoginPage from './components/auth/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/inquiryPage" element={<InquiryPage />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/dashboardPage" element={<DashboardPage />} />
        <Route path="/signup" element={<SignupPage />} /> {/* 회원가입 페이지 */}
        <Route path="/login" element={<LoginPage />} /> {/* 로그인 페이지 */}
      </Routes>
    </Router>
  );
};

export default App;
