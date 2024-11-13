import React from 'react';
import './IntroSection.css';

const downloadLauncher = async () => {
  try {
    setDownloading(true);
    setError(null);
    
    const response = await fetch(`/api/launcher/version/windows`);
    const buildInfo = await response.json();
    window.location.href = buildInfo.downloadUrl;
  } catch (err) {
    setError('다운로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    console.error('Download error:', err);
  } finally {
    setDownloading(false);
  }
};

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
          <a href="https://launchertest.s3.ap-northeast-2.amazonaws.com/Land-Of-Rex-Setup.exe" download className="download-button">
            런처 다운로드
          </a>
        </div>
      </div>
    </section>
  );
});

export default IntroSection;
