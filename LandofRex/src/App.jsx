import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import React from 'react';
import MainPage from './components/mainPage/MainPage';
import AdminPage from './components/adminPage/AdminPage';
import InquiryPage from './components/adminPage/inquiryPage/InquiryPage';
import UserManagement from './components/adminPage/userManagement/UserManagement'
import DashboardPage from './components/adminPage/dashboardPage/DashboardPage'
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import PostDetailPage from './components/postDetailPage/PostDetailPage';
import PostPage from './components/postDetailPage/PostDetailPage';
import NoticeList from './components/noticeListPage/NoticeListPage';
import NoticeCreatePage from './components/noticeCreatePage/NoticeCreatePage'
import NoticeEditPage from './components/noticeEditPage/NoticeEditPage'
import NoticeDetailPage from './components/noticeDetailPage/NoticeDetailPage'
import { AuthProvider } from './context/AuthContext';


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/inquiryPage" element={<InquiryPage />} />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/dashboardPage" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage/>}/>
          <Route path="/posts" element={<PostPage/>}/>

          <Route path="/admin/notices" element={<NoticeList />} />
          <Route path="/admin/notices/create" element={<NoticeCreatePage />} />
          <Route path="/admin/notices/:id/edit" element={<NoticeEditPage />} />
          <Route path="/admin/notices/:id" element={<NoticeDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  );
};

export default App;
