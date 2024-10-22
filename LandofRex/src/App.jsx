import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import MainPage from './components/mainPage/MainPage';
import AdminPage from './components/adminPage/AdminPage';




const App = () => {
  
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/adminPage" element={<AdminPage />} />

      </Routes>
    </Router>
  );
};

export default App;
