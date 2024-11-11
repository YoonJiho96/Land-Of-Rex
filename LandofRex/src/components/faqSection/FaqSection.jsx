import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FaqSection.css';

const FaqSection = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const [openIndices, setOpenIndices] = useState({});

  const handleInquiryClick = () => {
    navigate('/editorPage'); // EditorPage로 이동
  };

  const toggleAnswer = (index) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs = [
    { question: '게임을 어떻게 시작하나요?', answer: '게임 시작 버튼을 눌러 게임을 시작할 수 있습니다.' },
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
