import React, { useRef, useState,useEffect ,useCallback} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import './MyEditor-reusable.css';

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
    const [existingImages, setExistingImages] = useState(new Map());
    const additionalFieldsRef = useRef(additionalFields);

    console.log('TextEditor - Received additionalFields:', additionalFields); // props로 받은 값

    useEffect(() => {
      additionalFieldsRef.current = additionalFields;
  }, [additionalFields]);


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
                const imagesMap = new Map();
                Array.from(imgs).forEach((img, index) => {
                  if (initialData.images[index]) {
                      const imageUrl = initialData.images[index].urlCloud;
                      const imageId = initialData.images[index].id; // 이미지 ID 저장
                      img.src = imageUrl;
                      img.setAttribute('data-image-id', imageId); // 이미지 요소에 ID 저장
                      imagesMap.set(imageUrl, imageId);
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

    // 에디터 내의 모든 이미지 순서 정보 추출
    const getImageOrderInfo = () => {
      const imgs = editorRef.current.dom.select('img');
      const orderInfo = {
          existingImages: [], // { id: number, order: number }
          newImages: []      // { tempUrl: string, order: number }
      };

      Array.from(imgs).forEach((img, index) => {
          const imageId = img.getAttribute('data-image-id');
          if (imageId) {
              // 기존 이미지
              orderInfo.existingImages.push({
                  id: parseInt(imageId),
                  order: index
              });
          } else if (img.src.startsWith('blob:')) {
              // 새로운 이미지
              orderInfo.newImages.push({
                  tempUrl: img.src,
                  order: index
              });
          }
      });

      return orderInfo;
    };

    const getEditorImages = async () => {
      const imageOrderInfo = getImageOrderInfo();
      const files = [];

      const fetchPromises = imageOrderInfo.newImages.map(async ({ tempUrl, order }) => {
          try {
              const response = await fetch(tempUrl);
              const blob = await response.blob();
              const file = new File([blob], `image-${Date.now()}-${order}.jpg`, { type: blob.type });
              files.push({
                  file,
                  order
              });
          } catch (error) {
              console.error('Error fetching image:', error);
          }
      });

      await Promise.all(fetchPromises);
      return files;
    };

    

    const handleSubmit = useCallback(async () => {
      const formData = new FormData();
      const editor = editorRef.current;
      
      const rawHtml = editor.getContent({ format: 'raw' });

      // console.log('Submit Data Check:', {
      //       initialData,
      //       additionalFields: additionalFieldsRef.current // ref 값 출력
      //   });

      formData.append(requestKey, JSON.stringify({
          title: document.getElementById("postTitle").value,
          content: rawHtml,
          ...additionalFieldsRef.current
      }));

      const newImages = await getEditorImages();
      newImages.forEach(({ file, order }) => {
          formData.append('ImageFiles', file);
          formData.append('ImageOrders', order.toString());
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
  }, [additionalFields, apiEndpoint, method, onSubmitSuccess, requestKey]);

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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="postTitle" 
          placeholder="제목을 입력하세요" 
          className="text-editor-input"
        />
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(evt, editor) => {
          editorRef.current = editor;
          setIsEditorReady(true);
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
