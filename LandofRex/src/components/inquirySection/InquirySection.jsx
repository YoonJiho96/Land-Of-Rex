import React from 'react';
import './InquirySection.css';

const InquirySection = React.forwardRef((props, ref) => {
  return (
    <section ref={ref} className="inquiry-section">
      <div className="inquiry-content">
        <h2>1:1 문의</h2>
        <form className="inquiry-form">
          <label htmlFor="name">이름:</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="email">이메일:</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="message">메시지:</label>
          <textarea id="message" name="message" required></textarea>
          <button type="submit">문의하기</button>
        </form>
        <div className="faq">
          <h3>자주 묻는 질문</h3>
          <p>게임 설치 관련 문제와 계정 문의에 대해 자주 묻는 질문을 확인해보세요.</p>
        </div>
      </div>
    </section>
  );
});

export default InquirySection;
