import React, { useState } from 'react';
import Swal from 'sweetalert2'; // sweetalert2 import
import './FaqSection.css';
import { useAuth } from '../../../context/AuthContext';

const FaqSection = React.forwardRef((props, ref) => {
  const [openIndices, setOpenIndices] = useState({});
  const { isLoggedIn } = useAuth();

  const handleInquiryClick = () => {
    if (isLoggedIn) {
      window.open('/editorPage', '_blank', 'width=700,height=800,left=100,top=100');
    } else {
      Swal.fire({
        title: "로그인이 필요합니다",
        text: "문의하기를 이용하려면 로그인 해주세요.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "로그인 하기",
        cancelButtonText: "취소",
        customClass: {
          confirmButton: 'swal2-confirm-button', 
          cancelButton: 'swal2-cancel-button',
          actions: 'swal2-button-spacing' // 버튼 간격을 위한 클래스 추가
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/login';
        }
      });
    }
  };

  const toggleAnswer = (index) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    { question: '게임을 어떻게 시작하나요?', answer: '런처 다운로드 후 게임을 시작할 수 있습니다.' },
    { question: '랭킹은 어떻게 확인하나요?', answer: '랭킹 섹션에서 현재 순위를 확인할 수 있습니다.' },
    { question: '문의는 어디서 할 수 있나요?', answer: '문의 섹션을 이용해 질문을 남길 수 있습니다.' },
  ];

  return (
    <section className="faq-section" ref={ref}>
      <h2>FAQ</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleAnswer(index)}>
              <h3>{faq.question}</h3>
              <span className="toggle-icon">{openIndices[index] ? '-' : '+'}</span>
            </div>
            {openIndices[index] && <p className="faq-answer">{faq.answer}</p>}
          </div>
        ))}
      </div>
      <button className="inquiry-button" onClick={handleInquiryClick}>
        문의하기
      </button>
    </section>
  );
});

export default FaqSection;
