import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextEditorWithCustomImageUpload from '../../components/editor/MyEditor-reusable';
import './PostCreatePage.css';

const PostCreatePage = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('FREE');

  const postTypes = [
    { value: 'INQUIRY', label: '문의사항' },
    { value: 'QUESTION', label: '질문' },
    { value: 'FREE', label: '자유게시글' },
    { value: 'SUGGESTION', label: '건의사항' },
  ];

  return (
    <div className="notice-create-container">
      <h1>일반 게시글 작성</h1>
      <div className="type-selector">
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">게시글 유형을 선택해주세요</option>
          {postTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      
      <TextEditorWithCustomImageUpload 
        apiEndpoint="/api/v1/posts"
        requestKey="PostCreateRequest"
        additionalFields={{ requirePostType: true,postType: selectedType }} 
        onSubmitSuccess={() => navigate('/posts')}
      />
    </div>
  );
};

export default PostCreatePage;