import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PostDetailPage.css"; // CSS 파일 연결

const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const { postId } = useParams(); // URL의 id 파라미터 가져오기
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8080"; // 또는 프로덕션 URL을 사용할 수 있습니다.

  useEffect(() => {
    fetchPostDetails(postId);
  }, [postId]);

  const fetchPostDetails = async (postId) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/posts/${postId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      const postData = await response.json();
      setPost(postData);
    } catch (err) {
      console.error("Error fetching post details:", err);
      setError(err.message);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>
            <strong>작성자:</strong> {post.authorNickname}
          </p>
          <p>
            <strong>상태:</strong> {post.status}
          </p>
          <p>
            <strong>작성일:</strong> {new Date(post.createdAt).toLocaleString()}
          </p>
          <div
            id="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          {post.postImages && (
            <div>
              {post.postImages.map((image, index) => (
                <img key={index} src={image.urlCloud} alt={`Post Image ${index}`} />
              ))}
            </div>
          )}
          <button onClick={() => navigate(-1)}>뒤로가기</button>
        </>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default PostDetailPage;
