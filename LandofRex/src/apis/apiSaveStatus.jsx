import axios from "axios";

/**
 * Updates the inquiry status for a specific post.
 * 
 * @param {number|string} id - The ID of the post to update.
 * @param {string} inquiryStatus - The new status for the inquiry. 
 * Values can be one of the following:
 * - "CHECKED"
 * - "UNCHECKED"
 * - "IN_PROGRESS"
 * - "RESOLVED"
 * - "REJECTED"
 * 
 * @returns {Promise} - The Axios response promise.
 */
const apiSaveStatus = async (id, inquiryStatus) => {
  const url = `https://k11e102.p.ssafy.io/api/v1/posts/${id}/inquiry-status`;
  const body = { inquiryStatus };
  const config = {
    withCredentials: true, // 쿠키 포함
  };

  try {
    // 로그 출력
    console.log("URL:", url);
    console.log("Body:", JSON.stringify(body, null, 2));
    console.log("Headers:", headers);

    const response = await axios.patch(url, body, config);

    console.log("Response:", response.data); // 성공 시 응답 데이터 로그
    return response.data;
  } catch (error) {
    console.error("Error updating inquiry status:", error.response?.data || error.message);
    throw error;
  }
};

export default apiSaveStatus;
