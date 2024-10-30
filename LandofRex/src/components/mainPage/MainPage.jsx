// import React, { useRef, useEffect, useState } from 'react';
// import './MainPage.css';

// const MainPage = () => {
//   // 각 섹션에 대한 ref 생성
//   const introRef = useRef(null);
//   const noticesRef = useRef(null);
//   const rankingRef = useRef(null);
//   const inquiryRef = useRef(null);

//   const [activeSection, setActiveSection] = useState('intro');

//   // 스크롤 위치 감지를 위한 Intersection Observer 설정
//   useEffect(() => {
//     const sections = [
//       { ref: introRef, name: 'intro' },
//       { ref: noticesRef, name: 'notices' },
//       { ref: rankingRef, name: 'ranking' },
//       { ref: inquiryRef, name: 'inquiry' },
//     ];

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
//             const sectionName = sections.find(section => section.ref.current === entry.target)?.name;
//             setActiveSection(sectionName);
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     sections.forEach(section => observer.observe(section.ref.current));

//     return () => observer.disconnect();
//   }, []);

//   // 특정 섹션으로 스크롤하는 함수
//   const scrollToSection = (ref) => {
//     ref.current.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <div className="main-page">
//       {/* 네비게이션 바 */}
//       <nav className="navbar">
//         <div className="logo">E102</div>
//         <ul className="nav-links">
//           <li
//             onClick={() => scrollToSection(introRef)}
//             className={activeSection === 'intro' ? 'active' : ''}
//           >
//             게임소개
//           </li>
//           <li
//             onClick={() => scrollToSection(noticesRef)}
//             className={activeSection === 'notices' ? 'active' : ''}
//           >
//             공지사항
//           </li>
//           <li
//             onClick={() => scrollToSection(rankingRef)}
//             className={activeSection === 'ranking' ? 'active' : ''}
//           >
//             랭킹
//           </li>
//           <li
//             onClick={() => scrollToSection(inquiryRef)}
//             className={activeSection === 'inquiry' ? 'active' : ''}
//           >
//             1:1 문의
//           </li>
//         </ul>
//         <div className="language-options">
//           <span>런처 다운로드</span>
//         </div>
//       </nav>

//       {/* 각 섹션 */}
//       <section ref={introRef} className="section intro">
//         <div className="content">
//           <h1>LAND OF REX</h1>
//           <p>독보적인 창작의 결과물을 만들고 확장하고 재창조함으로써 팬들이 경험하는 엔터테인먼트의 순간들을 무한히 연결하는 세계를 만들 것입니다.</p>
//         </div>
//       </section>

//       <section ref={noticesRef} className="section notices">
//         <div className="content">
//           <h2>공지사항</h2>
//           <p>최신 업데이트와 게임 관련 공지사항을 확인하세요.</p>
//         </div>
//       </section>

//       <section ref={rankingRef} className="section ranking">
//         <div className="content">
//           <h2>랭킹 대시보드</h2>
//           <p>최고의 플레이어 랭킹을 실시간으로 확인하세요.</p>
//         </div>
//       </section>

//       <section ref={inquiryRef} className="section inquiry">
//         <div className="content">
//           <h2>1:1 문의</h2>
//           <p>궁금한 사항이나 도움이 필요하면 문의해주세요.</p>
//         </div>
//       </section>

//       {/* 풋터 섹션 */}
//       <footer className="footer">
//         <div className="footer-content">
//           <p>© 2024 E102. All rights reserved.</p>
//           <p>Privacy Policy | Terms of Service</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default MainPage;

import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../navBar/NavBar.jsx';
import IntroSection from '../introSection/IntroSection.jsx';
import NoticeSection from '../noticeSection/NoticeSection.jsx';
import RankingSection from '../rankingSection/RankingSection.jsx';
import InquirySection from '../inquirySection/InquirySection.jsx';
import Footer from '../footer/Footer.jsx';
import './MainPage.css';


const MainPage = () => {
  const introRef = useRef(null);
  const noticesRef = useRef(null);
  const rankingRef = useRef(null);
  const inquiryRef = useRef(null);

  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { name: 'intro', ref: introRef, label: '게임소개' },
    { name: 'notices', ref: noticesRef, label: '공지사항' },
    { name: 'ranking', ref: rankingRef, label: '랭킹' },
    { name: 'inquiry', ref: inquiryRef, label: '1:1 문의' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionName = sections.find((section) => section.ref.current === entry.target)?.name;
            setActiveSection(sectionName);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section.ref.current));

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="main-page">
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} sections={sections} />
      <IntroSection ref={introRef} />
      <NoticeSection ref={noticesRef} />
      <RankingSection ref={rankingRef} />
      <InquirySection ref={inquiryRef} />
      <Footer />
    </div>
  );
};

export default MainPage;
