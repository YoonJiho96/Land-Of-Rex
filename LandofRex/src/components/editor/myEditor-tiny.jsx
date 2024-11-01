import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

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
            let content = editorRef.current.getContent();

            const formData = new FormData();
            images.forEach((image, index) => {
                formData.append(`images[${index}]`, image.blob, image.id);
            });

            try {
                const imageResponse = await axios.post('/your-image-upload-endpoint', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (!imageResponse.data || imageResponse.data.length !== images.length) {
                    throw new Error("Image upload response doesn't match images count");
                }

                content = images.reduce((updatedContent, image, index) => {
                    const imageUrl = imageResponse.data[index].url;
                    return updatedContent.replace(URL.createObjectURL(image.blob), imageUrl);
                }, content);

                const finalData = new FormData();
                finalData.append('content', content);

                await axios.post('http://localhost:8080/api/v1/posts', finalData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                console.log('Content saved successfully');
            } catch (error) {
                console.error('Error saving content:', error);
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
                    toolbar: 'undo redo | fontsize | bold italic | alignleft aligncenter alignright | image link',
                    content_style: 'p, span, .space { font-family: inherit; font-size: inherit; }', // Ensure consistent font style
                    file_picker_callback: handleCustomImageUpload,
                    setup: (editor) => {
                        editor.on('keydown', (event) => {
                            if (event.key === 'Tab') {
                                event.preventDefault();
                                editor.execCommand('mceInsertContent', false, calculateTabSpaces()); // Insert 4x font size space for Tab
                            }
                        });
                    }
                
                }}
            />
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default TextEditorWithCustomImageUpload;
