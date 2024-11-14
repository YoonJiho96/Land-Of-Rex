import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import swal from 'sweetalert'; // sweetalert import 추가
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
    const [initialContent, setInitialContent] = useState('');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [existingImages, setExistingImages] = useState(new Map());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');
    const additionalFieldsRef = useRef(additionalFields);
    
    useEffect(() => {
      additionalFieldsRef.current = additionalFields;
    }, [additionalFields]);

    useEffect(() => {
      if (initialData) {
        setTitle(initialData.title || '');
        const processContent = () => {
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = initialData.content || '';

            if (initialData.images) {
                const sortedImages = [...initialData.images].sort((a, b) => a.seq - b.seq);
                const imgs = contentDiv.getElementsByTagName('img');
                const imagesMap = new Map();
                Array.from(imgs).forEach((img, index) => {
                  const matchingImage = sortedImages.find(image => image.seq === index);
                  if (matchingImage) {
                      img.src = matchingImage.urlCloud;
                      img.setAttribute('data-image-id', matchingImage.imageId);
                      imagesMap.set(matchingImage.urlCloud, matchingImage.imageId);
                  }
                });

                setExistingImages(imagesMap);
            }

            setInitialContent(contentDiv.innerHTML);
        };
        processContent();
      }
    }, [initialData]);

    useEffect(() => {
      if (isEditorReady && editorRef.current && initialContent) {
          editorRef.current.setContent(initialContent);
      }
    }, [isEditorReady, initialContent]);

    const getImageSeqInfo = () => {
      const imgs = editorRef.current.dom.select('img');
      const seqInfo = {
          existingImages: [],
          newImages: []
      };

      Array.from(imgs).forEach((img, index) => {
          const imageId = img.getAttribute('data-image-id');
          if (imageId) {
              seqInfo.existingImages.push({
                  imageId: parseInt(imageId),
                  seq: index
              });
          } else if (img.src.startsWith('blob:')) {
              seqInfo.newImages.push({
                tempUrl: img.src,
                seq: index
              });
          }
      });

      return seqInfo;
    };

    const getEditorImages = async () => {
      const imageSeqInfo = getImageSeqInfo();
      const files = [];

      const fetchPromises = imageSeqInfo.newImages.map(async ({ tempUrl, seq }) => {
          try {
              const response = await fetch(tempUrl);
              const blob = await response.blob();
              const file = new File([blob], `image-${Date.now()}-${seq}.jpg`, { type: blob.type });
              files.push({
                  file,
                  seq
              });
          } catch (error) {
              console.error('Error fetching image:', error);
          }
      });

      await Promise.all(fetchPromises);
      return files;
    };

    const validateSubmission = () => {
      if (!title.trim()) {
          setValidationError('제목을 입력해주세요.');
          document.getElementById('postTitle')?.focus();
          return false;
      }

      if (additionalFieldsRef.current.requirePostType && !additionalFieldsRef.current.postType) {
        setValidationError('문의 유형을 선택해주세요.');
        return false;
      }

      setValidationError('');
      return true;
    };

    const handleSubmit = useCallback(async () => {
      if (onBeforeSubmit && !onBeforeSubmit()) {
        return;
      }

      if (!validateSubmission()) {
          return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);
      setValidationError('');

      const formData = new FormData();
      const editor = editorRef.current;
      const rawHtml = editor.getContent({ format: 'raw' });
      const imageSeqInfo=getImageSeqInfo();

      const { requirePostType, ...fieldsToSubmit } = additionalFieldsRef.current;

      const requestBody = {
        title: title,
        content: rawHtml,
        ...fieldsToSubmit,
      };

      // PUT method일 때만 imageSeqInfo 추가
      if (method.toUpperCase() === 'PATCH') {
          requestBody.imageSeqInfo = imageSeqInfo;
      }

      formData.append(requestKey, JSON.stringify(requestBody));

      const newImages = await getEditorImages();
      newImages.forEach(({ file, seq }) => {
          formData.append('ImageFiles', file);
      });

      try {
          await axios({
              method: method,
              url: apiEndpoint,
              data: formData,
              headers: {
                  'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
          });

          // SweetAlert success modal
          swal("제출이 완료되었습니다!", "작성한 게시물이 성공적으로 제출되었습니다.", "success")
            .then(() => {
              if (onSubmitSuccess) onSubmitSuccess(); // Success callback
              window.close(); // 창 닫기

            });

      } catch (error) {
        console.error('Error:', error);
        if (error.response?.data?.message) {
            setValidationError(error.response.data.message);
        } else {
            setValidationError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }, [title, additionalFields, apiEndpoint, method, onSubmitSuccess, requestKey, isSubmitting, onBeforeSubmit]);

    const handleImageUploadWithFileExplorer = (callback, value, meta) => {
        if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            
            input.onchange = function () {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                    const base64 = reader.result;
                    callback(base64, { title: file.name });
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
          onChange={(e) =>{
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
          plugins: 'image code link media',
          toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image ',
          content_style: `p, span, .space { font-family: inherit; font-size: inherit; }`,
          file_picker_callback: handleImageUploadWithFileExplorer,
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
              bseq: 'none',
              bseqRadius: '4px',
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
