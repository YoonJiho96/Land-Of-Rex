import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import MainPage from './components/mainPage/MainPage';
import AdminPage from './components/adminPage/AdminPage';
import InquiryPage from './components/adminPage/inquiryPage/InquiryPage';
import UserManagement from './components/adminPage/userManagement/UserManagement'
import DashboardPage from './components/adminPage/dashboardPage/DashboardPage'
import LoginPage from './components/auth/login';
import RegisterPage from './components/auth/register';
import PostDetailPage from './components/postDetailPage/PostDetailPage';



const App = () => {
  
  return (
    <Router>
      
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/inquiryPage" element={<InquiryPage />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/dashboardPage" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/post-detail/:postId" element={<PostDetailPage/>}/>

      </Routes>
    </Router>
  );
};

export default App;
