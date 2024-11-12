import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextEditorWithCustomImageUpload from '../../components/editor/MyEditor-reusable';
import './PostCreatePage.css';

const PostEditPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams(); // URL에서 게시글 ID 가져오기
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  const postTypes = [
    { value: 'INQUIRY', label: '문의사항' },
    { value: 'QUESTION', label: '질문' },
    { value: 'FREE', label: '자유게시글' },
    { value: 'SUGGESTION', label: '건의사항' },
  ];
  useEffect(() => {
    console.log('PostEditPage State Changed:', {
      selectedType,
      initialData,
      additionalFieldsToPass: { postType: selectedType }
    });
  }, [selectedType, initialData]);

  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/v1/posts/${postId}`);
        if (!response.ok) {
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setInitialData(data);
        setSelectedType(data.postType);
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('게시글을 불러오는데 실패했습니다.');
        navigate('/posts');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId, navigate]);

  if (isLoading) {
    return <div className="loading">로딩중...</div>;
  }


  return (
    <div className="notice-create-container">
      <h1>게시글 수정</h1>
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
      
      {initialData && (
        <TextEditorWithCustomImageUpload 
          apiEndpoint={`/api/v1/posts/${postId}`}
          requestKey="PostUpdateRequest"
          method="PATCH"
          initialData={{
            ...initialData,
            postType: selectedType // 직접 최신 selectedType 전달
          }}
          additionalFields={{ postType: selectedType }}
          onSubmitSuccess={() => navigate(`/posts/${postId}`)}
        />
      )}
    </div>
  );
};

export default PostEditPage;