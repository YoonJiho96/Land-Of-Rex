import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import test from '../../assets/react.svg';

const MainPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="main-page">
      <div className="content">
        <div className="header">
        </div>

        {/* 타이틀 */}
        <h1 className="title">Land<br />of<br />Rex</h1>

        {/* 다운로드 버튼과 QR 코드 컨테이너 */}
          <div className="download-button">
            <a 
              onClick={() => navigate('/adminPage')} // 클릭 시 바로 adminPage로 이동
              className="app-download"
              style={{ cursor: 'pointer' }} // 커서 설정
            >
              <img src={test} className="downloadImg" alt="앱 다운로드" />
            </a>
          </div>
        </div>
    </div>
  );
};

export default MainPage;
