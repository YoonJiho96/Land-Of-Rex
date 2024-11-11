import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import './MyEditor-reusable.css';

const TextEditorWithCustomImageUpload = ({ 
    apiEndpoint,  // API 엔드포인트
    requestKey = "PostCreateRequest",  // formData에 담길 key 이름
    additionalFields = {},  // 추가 필드 (isPinned 등)
    onSubmitSuccess  // 제출 성공 시 콜백
}) => {
    const editorRef = useRef(null);

    const getEditorImages = () => {
        return new Promise((resolve, reject) => {
            const imgs = editorRef.current.dom.select('img');
            const files = [];

            const fetchPromises = imgs.map(img => {
                const blobUrl = img.src;
                if (blobUrl.startsWith('blob:')) {
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
            await axios.post(`${apiEndpoint}`, formData, {
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
      <div className="text-editor-container">
        <input 
          type="text" 
          id="postTitle" 
          placeholder="제목을 입력하세요" 
          className="text-editor-input"
        />
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        init={{
          height: 380, // 높이 조정
          menubar: false,
          plugins: 'image code link media',
          toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image | save',
          content_style: `p, span, .space { font-family: inherit; font-size: inherit; }`,
          file_picker_callback: handleImageUploadWithFileExplorer,
          setup: (editor) => {
            editor.ui.registry.addButton('save', {
              text: '저장',
              onAction: function () {
                handleSubmit();
                console.log("save api send");
              }
            });
          }
        }}
        className="tinymce-editor"
      />
    </div>
    );
};

export default TextEditorWithCustomImageUpload;
