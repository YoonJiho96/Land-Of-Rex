import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { baseUrl } from '../../config/url';

const TinyMCEEditor = () => {
  const editorRef = useRef(null);
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (blobInfo) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());

      const response = await fetch(`${baseUrl}/api/v1/posts`, {
        method: 'POST',
        headers: {
          // Authorization 헤더가 필요한 경우 추가
          // 'Authorization': `Bearer ${your_token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.imageUrl; // 서버에서 반환한 이미지 URL
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // 전체 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!editorRef.current) return;

    try {
      const editorContent = editorRef.current.getContent();
      const images = extractImagesFromContent(editorContent);
      
      const formData = new FormData();
      formData.append('content', editorContent);

      // 이미지 파일들을 FormData에 추가
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await fetch(`${baseUrl}/api/v1/posts`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Submit failed');
      }

      const result = await response.json();
      console.log('Submit success:', result);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  // HTML 컨텐츠에서 이미지 추출 유틸리티 함수
  const extractImagesFromContent = async () => {
    const editor = editorRef.current;
    if (!editor) return [];

    const images = editor.getBody().getElementsByTagName('img');
    const imageFiles = [];

    for (const img of images) {
        const src = img.getAttribute('src');
        if (src?.startsWith('blob:')) {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const fileName = src.split('/').pop() || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type });
            imageFiles.push(file);
        } catch (error) {
            console.error('Error converting blob URL to file:', error);
        }
        }
    }

    return imageFiles;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY} 
        onInit={(evt, editor) => editorRef.current = editor}
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | image',
          images_upload_handler: handleImageUpload,
          images_reuse_filename: true,
          automatic_uploads: true,
          images_file_types: 'jpg,jpeg,png,gif,webp',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isUploading ? '업로드 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
};

export default TinyMCEEditor;