import React, { useState } from 'react';
import './IntroSection.css';
import {baseUrl} from '@/config/url'

const IntroSection = React.forwardRef((props, ref) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const downloadLauncher = async (e) => {
    e.preventDefault();
    
    try {
      setDownloading(true);
      setError(null);
      
      const response = await fetch(`${baseUrl}/api/v1/launcher/url`);
      const urlInfo = await response.json();
      // console.log(urlInfo)
      window.location.href = urlInfo.data;
    } catch (err) {
      setError('다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section ref={ref} className="intro-section">
      <div className="intro-content">
        <p>LAND OF REX</p>
        <img src="/images/intro-image.png" alt="게임 이미지" className="intro-image" />
        
        <div className="download-button-container">
          <div className="download-description">
            런처로 게임 실행이 더욱 간편해집니다. 지금 다운로드 받으세요.
          </div>
          <button 
            onClick={downloadLauncher}
            disabled={downloading}
            className="download-button"
          >
            {downloading ? '다운로드 중...' : '런처 다운로드'}
          </button>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default IntroSection;