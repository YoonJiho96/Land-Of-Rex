// apiFaqList.jsx
import axios from 'axios';

const getFaqList = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`https://k11e102.p.ssafy.io/api/v1/posts`, {
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch FAQ list:', error);
    throw error;
  }
};

export default getFaqList;
