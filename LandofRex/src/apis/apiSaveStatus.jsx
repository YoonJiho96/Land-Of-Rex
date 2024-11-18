import axios from "axios";

const apiSaveStatus = async (id, inquiryStatus) => {
  const url = `https://k11e102.p.ssafy.io/api/v1/posts/${id}/inquiry-status`;
  const body = { inquiryStatus };

  try {
    console.log("Sending PATCH request...");
    console.log("URL:", url);
    console.log("Body:", JSON.stringify(body));

    const response = await axios.patch(url, body, {
      withCredentials: true, // 쿠키 포함
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating inquiry status:", error.response?.data || error.message);
    throw error;
  }
};

export default apiSaveStatus; 
