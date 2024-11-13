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
import PostPage from './components/postListPage/PostListPage';
import PostCreatePage from './components/postCreatePage/PostCreatePage'
import PostEditPage  from './components/postEditPage/PostEditPage';
import NoticeList from './components/noticeListPage/NoticeListPage';
import NoticeCreatePage from './components/noticeCreatePage/NoticeCreatePage'
import NoticeEditPage from './components/noticeEditPage/NoticeEditPage'
import NoticeDetailPage from './components/noticeDetailPage/NoticeDetailPage'
import EditorSection from './components/editor/EditorSection';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import MyPostList from './components/myPost/MyPostList';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/adminPage" element={<AdminPage />} />
          <Route path="/inquiryPage" element={<InquiryPage />} />
          <Route path="/userManagement" element={<UserManagement />} />
          <Route path="/dashboardPage" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/posts/create" element={<PostCreatePage/>}/> */}
          <Route path="/posts/:postId" element={<PostDetailPage/>}/>
          <Route path="/posts/:postId/edit" element={<PostEditPage/>}/>
          <Route path="/posts" element={<PostPage/>}/>
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/admin/notices/create" element={<NoticeCreatePage />} />
          <Route path="/admin/notices/:noticeId/edit" element={<NoticeEditPage />} />
          <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
          <Route path="/editorPage" element={<EditorSection/>} />
          <Route path="/my/posts" element={<MyPostList/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
