import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyEditor from '../../components/editor/MyEditor-reusable';
import '../noticeCreatePage/NoticeCreatePage.css';  // 같은 스타일 사용

const NoticeEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();  // URL에서 notice id 가져오기
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 공지사항 데이터 가져오기
  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        setIsLoading(true);
        // API 호출 예시
        // const response = await axios.get(`/api/notices/${id}`);
        // const { title, content } = response.data;
        
        // 임시 데이터
        const tempData = {
          title: '기존 공지사항 제목',
          content: '기존 공지사항 내용'
        };
        
        setTitle(tempData.title);
        setContent(tempData.content);
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        alert('공지사항을 불러오는데 실패했습니다.');
        navigate('/admin/notices');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNoticeData();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      // API 호출 예시
      // const response = await axios.put(`/api/notices/${id}`, formData);
      navigate('/admin/notices');
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="notice-create-container">로딩 중...</div>;
  }

  return (
    <div className="editor-container">
      <h2 className="editor-title">공지사항 수정</h2>
      
      <form onSubmit={handleSubmit} className="notice-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        <div className="form-group">
          <label>내용</label>
          <MyEditor
            value={content}
            onEditorChange={(value) => setContent(value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="files">첨부파일</label>
          <input
            id="files"
            type="file"
            onChange={(e) => setFiles([...e.target.files])}
            multiple
          />
        </div>

        <div className="button-group">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/admin/notices')}
          >
            취소
          </button>
          <button type="submit" className="submit-button">
            수정
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeEditPage;