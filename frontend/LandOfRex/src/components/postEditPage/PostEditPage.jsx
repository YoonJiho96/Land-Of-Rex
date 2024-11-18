import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextEditorWithCustomImageUpload from '../editor/MyEditor-reusable';
import '@/components/editor/EditorSection.css';

const PostEditPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams(); // URL에서 게시글 ID 가져오기
  const [postTypes, setPostTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchPostTypes = async () => {
      try {
        const response = await fetch(`/api/v1/post-types`);
        const data = await response.json();
        setPostTypes(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch post types:', error);
        setError('문의 유형을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setIsLoading(false);
      }
    };

    fetchPostTypes();
  }, []);
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
    <div className="editor-container">
      <h2 className="editor-title">문의글 수정</h2>
      <div className="type-selector">
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">문의 유형을 선택해주세요</option>
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