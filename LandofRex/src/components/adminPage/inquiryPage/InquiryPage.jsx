import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import "./InquiryPage.css";

const InquiryPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("문의내역");
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    // 실제 API 호출로 교체할 수 있는 부분
    const fetchInquiries = () => {
      // 더미 데이터 생성
      const dummyInquiries = [
        { 
          id: 5, 
          type: "게임 문의", 
          title: "레벨이 낮아졌어요",
          date: "2024.01.23",
          status: "답변 전"
        },
        {
          id: 4,
          type: "기타",
          title: "환불해주세요",
          date: "2024.01.20",
          status: "답변 전"
        },
        {
          id: 3,
          type: "피드백",
          title: "생각보다 재밌어요",
          date: "2024.01.20",
          status: "답변 전"
        },
        {
          id: 2,
          type: "피드백",
          title: "용병이 너무 느려요",
          date: "2024.01.20",
          status: "답변 완료"
        },
        {
          id: 1,
          type: "피드백",
          title: "너무 재밌어요",
          date: "2024.01.20",
          status: "답변 완료"
        }
      ];
      setInquiries(dummyInquiries);
    };

    fetchInquiries();
  }, []);

  return (
    <div className="admin-page-layout">
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="admin-page-content">
        <div className="admin-header">
          <h1>문의내역</h1>
        </div>
        
        <div className="inquiry-table-container">
          <table className="inquiry-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>유형</th>
                <th>제목</th>
                <th>날짜</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.type}</td>
                  <td>{inquiry.title}</td>
                  <td>{inquiry.date}</td>
                  <td>{inquiry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;