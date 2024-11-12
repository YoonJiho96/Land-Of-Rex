import React, { useState ,useEffect} from 'react';
import MyEditor from './MyEditor-reusable';
import './EditorSection.css';
import {baseUrl} from '../../config/url'

const EditorSection = React.forwardRef((props, ref) => {
  const [selectedType, setSelectedType] = useState('');
  const [postTypes, setPostTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeError, setTypeError] = useState('');

  useEffect(() => {
    const fetchPostTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/post-types`);
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

  // 문의 유형 선택 시 에러 메시지 초기화
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setTypeError('');
  };

  // 제출 전 유효성 검사를 수행하는 함수
  const handleBeforeSubmit = () => {
    if (!selectedType) {
      setTypeError('문의 유형을 선택해주세요.');
      // select 요소로 스크롤
      document.querySelector('.type-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }
    return true;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section ref={ref} className="editor-section">
      <div className="editor-container">
        <h2 className="editor-title">문의하기</h2>
        <p className="editor-description">문의 유형을 선택하고, 자세한 내용을 입력해 주세요.</p>
        
        <div className="type-selector">
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className={`type-select ${typeError ? 'error' : ''}`}
          >
            <option value="">문의 유형을 선택해주세요</option>
            {postTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {typeError && (
            <div className="error-message" role="alert">
              {typeError}
            </div>
          )}
        </div>
        
        <MyEditor
          apiEndpoint="/api/v1/posts"
          requestKey="PostCreateRequest"
          additionalFields={{ postType: selectedType }}
          className="tinymce-container"
          onBeforeSubmit={handleBeforeSubmit}
        />

        {/* <button className="submit-button" disabled={!selectedType}>제출하기</button> */}
      </div>
    </section>
  );
});

export default EditorSection;
