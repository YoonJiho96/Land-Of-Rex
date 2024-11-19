import axios from "axios";

const apiSaveStatus = async (id, inquiryStatus) => {
  const url = `/api/v1/posts/${id}/inquiry-status`;
  const body = { inquiryStatus };

  try {
    const response = await axios.patch(url, body, {
      withCredentials: true, // 쿠키 포함
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiSaveStatus; 
