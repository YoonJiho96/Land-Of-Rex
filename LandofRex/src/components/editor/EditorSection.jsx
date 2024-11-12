import React, { useState } from 'react';
import MyEditor from './MyEditor-reusable';
import './EditorSection.css';

const EditorSection = React.forwardRef((props, ref) => {
  const [selectedType, setSelectedType] = useState('FREE');

  const postTypes = [
    { value: 'ACCOUNT_ISSUE', label: '계정 문제' },
    { value: 'BUG_REPORT', label: '버그 신고' },
    { value: 'SUGGESTION', label: '건의 사항' },
    { value: 'GAME_FEEDBACK', label: '게임 피드백' },
  ];

  return (
    <section ref={ref} className="editor-section">
      <div className="editor-container">
        <h2 className="editor-title">문의하기</h2>
        <p className="editor-description">문의 유형을 선택하고, 자세한 내용을 입력해 주세요.</p>
        
        <div className="type-selector">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-select"
          >
            <option value="">문의 유형을 선택해주세요</option>
            {postTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <MyEditor
          apiEndpoint="/api/v1/posts"
          requestKey="PostCreateRequest"
          additionalFields={{ postType: selectedType }}
          className="tinymce-container"
        />

        <button className="submit-button">제출하기</button>
      </div>
    </section>
  );
});

export default EditorSection;
