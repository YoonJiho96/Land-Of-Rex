import React from 'react';
import './IntroSection.css';

const IntroSection = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} className="intro-section">
      <div className="intro-content">
        <h1>LAND OF REX</h1>
        <p>창작과 확장의 새로운 세계로 오신 것을 환영합니다.</p>
        <img src="/path/to/image.jpg" alt="게임 이미지" className="intro-image" />
        <div className="features">
          <h3>게임 특징</h3>
          <ul>
            <li>풍부한 스토리와 몰입도 높은 플레이</li>
            <li>다양한 캐릭터와 커스터마이징 옵션</li>
            <li>실시간 멀티플레이와 랭킹 시스템</li>
          </ul>
        </div>
      </div>
    </section>
  );
});

export default IntroSection;
