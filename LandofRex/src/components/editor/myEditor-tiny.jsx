import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import {baseUrl} from '../../config/url.js'

const TextEditorWithCustomImageUpload = () => {
    const editorRef = useRef(null);
    const [images, setImages] = useState([]); // Store images temporarily

    const getEditorImages = () => {
        return new Promise((resolve, reject) => {
            const imgs = editorRef.current.dom.select('img');
            const files = [];

            const fetchPromises = imgs.map(img => {
                const blobUrl = img.src;
                if (blobUrl.startsWith('blob:')) {
                    // Blob URL로부터 실제 File 객체 가져오기
                    return fetch(blobUrl)
                        .then(response => response.blob())
                        .then(blob => {
                            const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });
                            files.push(file);
                        });
                }
                return null;
            });

            // 모든 fetch가 끝나면 resolve
            Promise.all(fetchPromises)
                .then(() => resolve(files))
                .catch(reject);
        });
    };

    // 제출 시 사용
    const handleSubmit = async () => {
        const formData = new FormData();
        const editor = editorRef.current;
        
        const rawHtml = editor.getContent({ format: 'raw' });
        formData.append("PostCreateRequest", JSON.stringify({
            title: document.getElementById("postTitle").value,
            content: rawHtml
        }));

        // 에디터의 이미지들을 가져와서 추가
        const imageFiles = await getEditorImages(); // 모든 fetch가 완료될 때까지 기다림
        imageFiles.forEach((file, index) => {
            console.log('File:', file);
            formData.append('ImageFiles', file,`image_${index}.jpg`);
        });

        try {
            axios.post(`${baseUrl}/api/v1/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <input 
                type="text" 
                id="postTitle" 
                placeholder="제목을 입력하세요" 
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }} // style 객체로 수정
            />
            <Editor
                apiKey = {import.meta.env.VITE_TINYMCE_API_KEY}  // Vite
                onInit={(evt, editor) => {
                    editorRef.current = editor;
                }}
                   
                init={{
                    height: 500,
                    menubar: false,
                    plugins: 'image code link',
                    toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image link | save',
                    content_style: 'p, span, .space { font-family: inherit; font-size: inherit; }', // Ensure consistent font style
                    setup: (editor) => {
                        editor.ui.registry.addButton('save', {
                            text: '등록',
                            onAction: function () {
                                handleSubmit();
                                console.log("api save send"); // 여기서 서버에 데이터를 보내는 함수 호출
                            }
                        });
                    }
                }}
            />
            {/* <button onClick={handleSave}>Save</button> */}
        </div>
    );
};

export default TextEditorWithCustomImageUpload;
