import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../navBar/NavBar.jsx';
import IntroSection from '../introSection/IntroSection.jsx';
import NoticeSection from '../noticeSection/NoticeSection.jsx';
import RankingSection from '../rankingSection/RankingSection.jsx';
import InquirySection from '../inquirySection/InquirySection.jsx';
import EditorSection from '../editor/EditorSection.jsx';
import Footer from '../footer/Footer.jsx';
import './MainPage.css';

// MainPage 컴포넌트 정의
const MainPage = () => {
  // 각 섹션의 DOM 요소를 참조하기 위한 useRef 생성
  const introRef = useRef(null);
  const noticesRef = useRef(null);
  const rankingRef = useRef(null);
  const inquiryRef = useRef(null);
  const editorRef  = useRef(null);

  // 현재 활성화된 섹션을 관리하는 상태
  const [activeSection, setActiveSection] = useState('intro');

  // 섹션 정보를 배열로 저장해 네비게이션 및 스크롤 관리를 쉽게 설정
  const sections = [
    { name: 'intro', ref: introRef, label: '게임소개' },
    { name: 'notices', ref: noticesRef, label: '공지사항' },
    { name: 'ranking', ref: rankingRef, label: '랭킹' },
    // { name: 'inquiry', ref: inquiryRef, label: '1:1 문의' },
    { name: 'editor', ref: editorRef, label: '문의' },
  ];

  // Intersection Observer를 사용해 스크롤 위치에 따라 활성화된 섹션을 변경
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 화면에 50% 이상 보이는 섹션이 있을 때 해당 섹션을 활성화
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionName = sections.find((section) => section.ref.current === entry.target)?.name;
            setActiveSection(sectionName);
          }
        });
      },
      { threshold: 0.5 } // 50% 이상 화면에 보여야 활성화되도록 설정
    );

    // 각 섹션에 대해 Intersection Observer를 연결
    sections.forEach((section) => observer.observe(section.ref.current));

    // 컴포넌트 언마운트 시 observer 해제
    return () => observer.disconnect();
  }, [sections]);

  // 특정 섹션으로 스크롤 이동하는 함수
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="main-page">
      {/* Navbar 컴포넌트에 현재 활성화된 섹션 정보와 스크롤 함수 전달 */}
      <Navbar activeSection={activeSection} scrollToSection={scrollToSection} sections={sections} />
      
      {/* 각 섹션에 ref를 전달해 특정 위치에 접근 가능하도록 설정 */}
      <IntroSection ref={introRef} />
      <NoticeSection ref={noticesRef} />
      <RankingSection ref={rankingRef} />
      <EditorSection ref={editorRef}/>
      {/* <InquirySection ref={inquiryRef} /> */}
      
      {/* 페이지 하단의 Footer */}
      <Footer />
    </div>
  );
};

export default MainPage;
