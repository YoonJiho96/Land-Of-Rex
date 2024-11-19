import React, { useRef, useState,useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import {baseUrl} from '../../config/url.js'

const TextEditorWithCustomImageUpload = ({ 
    apiEndpoint,  // API 엔드포인트
    requestKey = "PostCreateRequest",  // formData에 담길 key 이름
    additionalFields = {},  // 추가 필드 (isPinned 등)
    onSubmitSuccess,  // 제출 성공 시 콜백
    initialData = null,  // 수정 시 초기 데이터
    method = 'POST'
}) => {
    const editorRef = useRef(null);
    const [title, setTitle] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [isEditorReady, setIsEditorReady] = useState(false);


    // 초기 데이터가 있을 경우 (수정 모드) 데이터 설정
    useEffect(() => {
      if (initialData) {
        setTitle(initialData.title || '');
        
        // 이미지 URL 처리
        const processContent = () => {
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = initialData.content || '';

            if (initialData.images) {
                const imgs = contentDiv.getElementsByTagName('img');
                Array.from(imgs).forEach((img, index) => {
                    if (initialData.images[index]) {
                        img.src = initialData.images[index].urlCloud;
                    }
                });
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

    const getEditorImages = () => {
        return new Promise((resolve, reject) => {
            const imgs = editorRef.current.dom.select('img');
            const files = [];

            const fetchPromises = imgs.map(img => {
                const imgSrc = img.src;
                if (imgSrc.startsWith('blob:')) {
                    return fetch(blobUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
                            files.push(file);
                        });
                }
                return null;
            });

            Promise.all(fetchPromises)
                .then(() => resolve(files))
                .catch(reject);
        });
    };


    const handleSubmit = async () => {
        const formData = new FormData();
        const editor = editorRef.current;
        
        const rawHtml = editor.getContent({ format: 'raw' });
        formData.append(requestKey, JSON.stringify({
            title: document.getElementById("postTitle").value,
            content: rawHtml,
            ...additionalFields  // 추가 필드 병합
        }));

        const imageFiles = await getEditorImages();
        imageFiles.forEach((file, index) => {
            formData.append('ImageFiles', file, `image_${index}.jpg`);
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
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
    }

    return (
      <div style={{ 
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="postTitle" 
          placeholder="제목을 입력하세요" 
          style={{ width: '100%', padding: '10px', marginBottom: '10px',boxSizing: 'border-box' }} // style 객체로 수정
        />
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setIsEditorReady(true);
        }}
        init={{
          height: 500,
          menubar: false,
          plugins: 'image code link media',
          toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image | save',
          content_style: `p, span, .space { font-family: inherit; font-size: inherit; }`,
          file_picker_callback: handleImageUploadWithFileExplorer,
          width: '100%',
          setup: (editor) => {
            editor.ui.registry.addButton('save', {
              text: '등록',
              onAction: function () {
                handleSubmit();
                console.log("save api send");
              }
            });
          }
        }}
      />
    </div>
    );
};

export default TextEditorWithCustomImageUpload;