import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import swal from 'sweetalert';
import './MyEditor-reusable.css';

// Types for better code organization
const ImageInfo = {
  urlCloud: string,
  imageId: string,
  order: number
};

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

    // Separate image state management
    const [imageMapping, setImageMapping] = useState(new Map());
    
    useEffect(() => {
      additionalFieldsRef.current = additionalFields;
    }, [additionalFields]);

    // Initialize editor with existing content and images
    const initializeEditor = useCallback(() => {
      if (!initialData) return;

      setTitle(initialData.title || '');
      
      const processInitialContent = () => {
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = initialData.content || '';
        
        // Process and map existing images
        if (initialData.images?.length) {
          const newImageMapping = new Map();
          const imgs = contentDiv.getElementsByTagName('img');
          
          Array.from(imgs).forEach((img, index) => {
            const currentImage = initialData.images[index];
            if (currentImage?.urlCloud) {
              const imageId = `img-${Date.now()}-${index}`;
              img.src = currentImage.urlCloud;
              img.setAttribute('data-image-id', imageId);
              newImageMapping.set(currentImage.urlCloud, {
                imageId,
                urlCloud: currentImage.urlCloud,
                order: index
              });
            }
          });

          setImageMapping(newImageMapping);
        }

        return contentDiv.innerHTML;
      };

      const processedContent = processInitialContent();
      if (isEditorReady && editorRef.current) {
        editorRef.current.setContent(processedContent);
      }
    }, [initialData, isEditorReady]);

    useEffect(() => {
      initializeEditor();
    }, [initializeEditor]);

    // Image processing helpers
    const collectImageInfo = useCallback(() => {
      if (!editorRef.current) return { existingImages: [], newImages: [] };

      const imgs = editorRef.current.dom.select('img');
      const imageInfo = {
        existingImages: [],
        newImages: []
      };

      Array.from(imgs).forEach((img, index) => {
        const imageId = img.getAttribute('data-image-id');
        if (imageId && imageMapping.has(img.src)) {
          imageInfo.existingImages.push({
            id: imageId,
            order: index
          });
        } else if (img.src.startsWith('blob:')) {
          imageInfo.newImages.push({
            tempUrl: img.src,
            order: index
          });
        }
      });

      return imageInfo;
    }, [imageMapping]);

    const processNewImages = async (imageInfo) => {
      const files = [];
      const fetchPromises = imageInfo.newImages.map(async ({ tempUrl, order }) => {
        try {
          const response = await fetch(tempUrl);
          const blob = await response.blob();
          const file = new File([blob], `image-${Date.now()}-${order}.jpg`, { type: blob.type });
          files.push({ file, order });
        } catch (error) {
          console.error('Error processing image:', error);
        }
      });

      await Promise.all(fetchPromises);
      return files;
    };

    // Form validation
    const validateForm = () => {
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

    // Submit handler
    const handleSubmit = useCallback(async () => {
      if (onBeforeSubmit && !onBeforeSubmit()) return;
      if (!validateForm() || isSubmitting) return;

      setIsSubmitting(true);
      setValidationError('');

      try {
        const formData = new FormData();
        const rawHtml = editorRef.current.getContent({ format: 'raw' });
        const imageInfo = collectImageInfo();
        const processedImages = await processNewImages(imageInfo);

        // Prepare form data
        const { requirePostType, ...fieldsToSubmit } = additionalFieldsRef.current;
        formData.append(requestKey, JSON.stringify({
          title,
          content: rawHtml,
          ...fieldsToSubmit
        }));

        // Append new images
        processedImages.forEach(({ file, order }) => {
          formData.append('ImageFiles', file);
          formData.append('ImageOrders', order.toString());
        });

        // Submit form
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
        console.error('Submit error:', error);
        setValidationError(error.response?.data?.message || '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    }, [title, apiEndpoint, method, onSubmitSuccess, requestKey, isSubmitting, onBeforeSubmit, collectImageInfo]);

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
            plugins: 'image code link media',
            toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image',
            content_style: 'p, span, .space { font-family: inherit; font-size: inherit; }',
            file_picker_callback: (callback, value, meta) => {
              if (meta.filetype === 'image') {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                
                input.onchange = function () {
                  const file = input.files[0];
                  const reader = new FileReader();
                  reader.onload = function () {
                    callback(reader.result, { title: file.name });
                  };
                  reader.readAsDataURL(file[0]);
                };

                input.click();
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