// NoticeCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditorWithCustomImageUpload from '../../components/editor/MyEditor-reusable';
import '@/components/editor/EditorSection.css';

const NoticeCreatePage = ({ onBack }) => { // onBack prop 받기
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(false);

  return (
    <div className="editor-container">
      <h2 className="editor-title">공지사항 작성</h2>
      <div 
        className="custom-checkbox-container"
        onClick={() => setIsPinned(!isPinned)}
      >
        <div className={`custom-checkbox ${isPinned ? 'checked' : ''}`} />
        <span className="checkbox-label">상단 고정</span>
      </div>
      
      <TextEditorWithCustomImageUpload 
        apiEndpoint="/api/v1/notices"
        requestKey="PostCreateRequest"
        additionalFields={{ isPinned, requirePostType: false }}
        onSubmitSuccess={() => {
          navigate('/dashboardPage');
          onBack(); // 공지사항 작성 후 목록으로 돌아가기
        }}
      />
    </div>
  );
};

export default NoticeCreatePage;