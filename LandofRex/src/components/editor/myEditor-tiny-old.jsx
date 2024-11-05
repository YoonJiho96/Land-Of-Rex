import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import {baseUrl} from '../../config/url.js'

const TextEditorWithCustomImageUpload = () => {
    const editorRef = useRef(null);
    const [images, setImages] = useState([]); // Store images temporarily
    const [currentFontSize, setCurrentFontSize] = useState('16px'); // Default font size

    const handleCustomImageUpload = (callback, value, meta) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        input.onchange = () => {
            const file = input.files[0];
            const tempUrl = URL.createObjectURL(file);

            // Update image state with a functional update to ensure previous images are retained
            setImages((prevImages) => [
                ...prevImages,
                { id: file.name, blob: file },
            ]);

            // Use temporary URL in TinyMCE editor
            callback(tempUrl, { alt: file.name });
        };
        input.click();
    };

    const handleSave = async () => {
        if (editorRef.current) {
            let content = editorRef.current.getBody().getElementsByTagName('p')[0];
                
            const formData = new FormData();

            formData.append("PostCreateRequest", JSON.stringify({
                title: document.getElementById("postTitle").value,
                text: content
            }));

            // Append images to FormData
            // images.forEach((image, index) => {
            //     formData.append(`images[${index}]`, image.blob, image.id);
            // });

            // Append images to FormData
            images.forEach((image) => {
                formData.append(`imageFiles`, image.blob);
            });
            
            try {
                // Send both content and images in one API call
                const response = await axios.post(`${baseUrl}/api/v1/posts`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
    
                console.log('Content and images saved successfully:', response.data);
            } catch (error) {
                console.error('Error saving content and images:', error);
            }
        }
    };
    

    // Helper to calculate spaces based on the current font size
    const calculateTabSpaces = () => {
        const editor = editorRef.current;
        if (editor) {
            // Get the font size at the cursor position
            const fontSize = parseInt(window.getComputedStyle(editor.selection.getNode()).fontSize, 10);
            const spaceCount = Math.round((fontSize / 4) * 4); // 4 times the font size space
            return ' '.repeat(spaceCount);
        }
        return '';
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
                    editor.on('NodeChange', () => {
                        const fontSize = window.getComputedStyle(editor.selection.getNode()).fontSize;
                        setCurrentFontSize(fontSize);
                    });
                }}
                
                   
                init={{
                    height: 500,
                    menubar: false,
                    plugins: 'image code link',
                    toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image link | save',
                    content_style: 'p, span, .space { font-family: inherit; font-size: inherit; }', // Ensure consistent font style
                    file_picker_callback: handleCustomImageUpload,
                    setup: (editor) => {
                        editor.on('keydown', (event) => {
                            if (event.key === 'Tab') {
                                event.preventDefault();
                                editor.execCommand('mceInsertContent', false, calculateTabSpaces()); // Insert 4x font size space for Tab
                            }
                        });
                        editor.ui.registry.addButton('save', {
                            text: '등록',
                            onAction: function () {
                                handleSave();
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
