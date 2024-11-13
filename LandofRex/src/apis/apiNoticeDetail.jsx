import axios from 'axios';

// 공지사항 세부 정보 요청 함수
export const fetchNoticeDetail = async (id) => {
  const apiUrl = `https://k11e102.p.ssafy.io/api/v1/notices/${id}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data; // 필요한 데이터 필드만 반환하도록 선택 가능
  } catch (error) {
    console.error(`공지사항 ${id} 데이터를 불러오는데 실패했습니다:`, error);
    throw error;
  }
};

export default fetchNoticeDetail;