import React from 'react';
import './IntroSection.css';

const IntroSection = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} className="intro-section">
      <div className="intro-content">
        <p>LAND OF REX</p>
        <img src="/images/intro-image.png" alt="게임 이미지" className="intro-image" />
        <div className="features">
        <h3>3D 탑뷰 디펜스 게임</h3>
        </div>
      </div>
    </section>
  );
});

export default IntroSection;
