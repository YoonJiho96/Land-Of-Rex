import React, { useState } from 'react';
import MyEditor from './MyEditor-reusable';

const EditorSection = React.forwardRef((props, ref) => {
  const [selectedType, setSelectedType] = useState('FREE');

  const postTypes = [
    { value: 'INQUIRY', label: '문의사항' },
    { value: 'QUESTION', label: '질문' },
    { value: 'FREE', label: '자유게시글' },
    { value: 'SUGGESTION', label: '건의사항' },
  ];

  return (
    <section ref={ref} className="editor-section">
      <div className="editor-container">
        <div className="type-selector">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-select"
          >
            <option value="">게시글 유형을 선택해주세요</option>
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
        />
      </div>
    </section>
  );
});

export default EditorSection;