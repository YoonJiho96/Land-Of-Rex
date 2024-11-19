import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import swal from 'sweetalert';
import './MyEditor-reusable.css';

const TextEditorWithCustomImageUpload = ({ 
    apiEndpoint,
    requestKey = "PostCreateRequest",
    additionalFields = {},
    onSubmitSuccess,
    initialData = null,
    method = 'POST',
    onBeforeSubmit
}) => {
    const editorRef = useRef(null);
    const [title, setTitle] = useState('');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const additionalFieldsRef = useRef(additionalFields);
    
    // URL을 키로, { imageId, sequence } 객체를 값으로 저장
    const [existingImagesMap, setExistingImagesMap] = useState(new Map());
    
    useEffect(() => {
      additionalFieldsRef.current = additionalFields;
    }, [additionalFields]);

    // 초기 컨텐츠와 이미지 처리
    const processInitialContent = useCallback(() => {
      if (!initialData) return '';
      
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = initialData.content || '';
      
      // 기존 이미지 매핑 처리
      if (initialData.images?.length) {
        const imagesMap = new Map();
        
        // 먼저 모든 이미지 정보를 맵에 저장
        initialData.images.forEach((image, sequence) => {
          if (image.urlCloud) {
            imagesMap.set(image.urlCloud, {
              imageId: `image-${sequence}`,
              sequence: sequence
            });
          }
        });

        // 컨텐츠의 이미지 태그에 data-image-id와 data-sequence 속성 추가
        const imgs = contentDiv.getElementsByTagName('img');
        Array.from(imgs).forEach(img => {
          const imgUrl = img.src;
          if (imagesMap.has(imgUrl)) {
            const { imageId, sequence } = imagesMap.get(imgUrl);
            img.setAttribute('data-image-id', imageId);
            img.setAttribute('data-sequence', sequence.toString());
          }
        });

        setExistingImagesMap(imagesMap);
      }

      setTitle(initialData.title || '');
      return contentDiv.innerHTML;
    }, [initialData]);

    // 초기화
    useEffect(() => {
      if (isEditorReady && editorRef.current) {
        const content = processInitialContent();
        editorRef.current.setContent(content);
        
        // 이미지 붙여넣기 이벤트 핸들러 설정
        editorRef.current.on('paste', function(e) {
          const clipboardData = e.clipboardData;
          if (!clipboardData) return;
          
          const items = clipboardData.items;
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              e.preventDefault();
              const blob = items[i].getAsFile();
              const reader = new FileReader();
              reader.onload = function(e) {
                const dataUrl = e.target.result;
                const newImageId = `new-image-${Date.now()}`;
                const img = `<img src="${dataUrl}" data-image-id="${newImageId}" data-sequence="${Date.now()}" />`;
                editorRef.current.insertContent(img);
              };
              reader.readAsDataURL(blob);
            }
          }
        });
      }
    }, [isEditorReady, processInitialContent]);

    // 현재 에디터의 이미지 정보 수집
    const getEditorImagesInfo = () => {
      if (!editorRef.current) return { existingImages: [], newImages: [] };

      const imgs = editorRef.current.dom.select('img');
      const imageInfo = {
        existingImages: [], // { imageId, sequence }
        newImages: []      // { tempUrl, sequence }
      };

      Array.from(imgs).forEach((img, currentIndex) => {
        const imageId = img.getAttribute('data-image-id');
        const sequence = currentIndex; // 현재 DOM 순서를 sequence로 사용

        if (imageId && existingImagesMap.has(img.src)) {
          imageInfo.existingImages.push({
            imageId: imageId,
            sequence: sequence
          });
        } else if (img.src.startsWith('data:') || img.src.startsWith('blob:')) {
          imageInfo.newImages.push({
            tempUrl: img.src,
            sequence: sequence
          });
        }
      });

      return imageInfo;
    };

    // 새로운 이미지를 파일로 변환
    const convertNewImagesToFiles = async (newImages) => {
      const files = [];
      const fetchPromises = newImages.map(async ({ tempUrl, sequence }) => {
        try {
          const response = await fetch(tempUrl);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}-${sequence}.jpg`, { type: blob.type });
          files.push({ file, sequence });
        } catch (error) {
          console.error('이미지 처리 중 오류:', error);
        }
      });

      await Promise.all(fetchPromises);
      return files;
    };

    const handleSubmit = useCallback(async () => {
      if (onBeforeSubmit && !onBeforeSubmit()) return;
      
      if (!title.trim()) {
        setValidationError('제목을 입력해주세요.');
        document.getElementById('postTitle')?.focus();
        return;
      }

      if (additionalFieldsRef.current.requirePostType && !additionalFieldsRef.current.postType) {
        setValidationError('문의 유형을 선택해주세요.');
        return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);
      setValidationError('');

      try {
        const formData = new FormData();
        const rawHtml = editorRef.current.getContent({ format: 'raw' });
        
        // 이미지 정보 수집 및 처리
        const imageInfo = getEditorImagesInfo();
        const processedFiles = await convertNewImagesToFiles(imageInfo.newImages);

        // 폼 데이터 준비
        const { requirePostType, ...fieldsToSubmit } = additionalFieldsRef.current;
        formData.append(requestKey, JSON.stringify({
          title,
          content: rawHtml,
          existingImagesInfo: imageInfo.existingImages, // 기존 이미지의 ID와 순서 정보
          ...fieldsToSubmit
        }));

        // 새 이미지 추가
        processedFiles.forEach(({ file, sequence }) => {
          formData.append('ImageFiles', file);
          formData.append('ImageSequences', sequence.toString());
        });

        await axios({
          method,
          url: apiEndpoint,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });

        await swal("제출이 완료되었습니다!", "작성한 게시물이 성공적으로 제출되었습니다.", "success");
        if (onSubmitSuccess) onSubmitSuccess();
        window.close();

      } catch (error) {
        console.error('제출 오류:', error);
        setValidationError(error.response?.data?.message || '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    }, [title, apiEndpoint, method, onSubmitSuccess, requestKey, isSubmitting, onBeforeSubmit]);

    const handleImageUpload = (callback, value, meta) => {
      if (meta.filetype === 'image') {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        
        input.onchange = function () {
          const file = input.files[0];
          const reader = new FileReader();
          reader.onload = function () {
            // 새 이미지에 고유 ID와 시퀀스 추가
            const newImageId = `new-image-${Date.now()}`;
            callback(reader.result, { 
              title: file.name,
              'data-image-id': newImageId,
              'data-sequence': Date.now().toString()
            });
          };
          reader.readAsDataURL(file);
        };

        input.click();
      }
    };

    return (
      <div className="text-editor-container">
        {validationError && (
          <div className="validation-error" role="alert">
            {validationError}
          </div>
        )}
        <input 
          type="text" 
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationError('');
          }}
          id="postTitle" 
          placeholder="제목을 입력하세요" 
          className={`text-editor-input ${validationError ? 'error' : ''}`}
        />
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;
            setIsEditorReady(true);
          }}
          init={{
            height: 380,
            menubar: false,
            plugins: 'image code link media paste',
            toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image',
            content_style: 'p, span, .space { font-family: inherit; font-size: inherit; }',
            file_picker_callback: handleImageUpload,
            paste_data_images: true,
            paste_preprocess: function(plugin, args) {
              // 붙여넣기 전처리
              const content = args.content;
              if (content.indexOf('<img') !== -1) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const imgs = tempDiv.getElementsByTagName('img');
                Array.from(imgs).forEach(img => {
                  if (!img.getAttribute('data-image-id')) {
                    const newImageId = `new-image-${Date.now()}`;
                    img.setAttribute('data-image-id', newImageId);
                    img.setAttribute('data-sequence', Date.now().toString());
                  }
                });
                args.content = tempDiv.innerHTML;
              }
            }
          }}
          className={`tinymce-editor ${validationError ? 'error' : ''}`}
        />
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isSubmitting ? '제출 진행 중...' : '제출하기'}
        </button>
      </div>
    );
};

export default TextEditorWithCustomImageUpload;