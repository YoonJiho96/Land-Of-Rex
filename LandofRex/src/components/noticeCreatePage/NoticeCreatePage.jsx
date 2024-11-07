// NoticeCreatePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditorWithCustomImageUpload from '../../components/editor/MyEditor-reusable';
import './NoticeCreatePage.css';

const NoticeCreatePage = () => {
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(false);

  return (
    <div className="notice-create-container">
      <h1>공지사항 작성</h1>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
          />
          상단 고정
        </label>
      </div>
      
      <TextEditorWithCustomImageUpload 
        apiEndpoint="/api/v1/notices"
        requestKey="NoticeCreateRequest"
        additionalFields={{ isPinned }}
        onSubmitSuccess={() => navigate('/admin/notices')}
      />
    </div>
  );
};

export default NoticeCreatePage;