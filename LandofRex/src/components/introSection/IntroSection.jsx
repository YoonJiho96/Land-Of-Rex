import React from 'react';
import './IntroSection.css';
import downloadIcon from '../../assets/download.png'; // 아이콘 파일을 가져오기

const IntroSection = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} className="intro-section">
      <div className="intro-content">
        <p>LAND OF REX</p>
        <img src="/images/intro-image.png" alt="게임 이미지" className="intro-image" />
        
        <div className="download-button-container">
          <div className="download-description">
            런처로 게임 실행이 더욱 간편해집니다. 지금 다운로드 받으세요.
          </div>
          <a href="/path/to/launcher-download" download className="download-button">
            런처 다운로드
          </a>
        </div>
      </div>
    </section>
  );
});

export default IntroSection;
