import axios from 'axios';

const apiUrl = 'https://k11e102.p.ssafy.io/api/v1/rankings/2';

// 랭킹 목록 요청 함수
export const fetchRankingList2 = async () => {
  try {
    const response = await axios.get(apiUrl);
    if (response.data.success) {
      // data 배열을 가공하여 날짜 형식을 "YYYY년 MM월 DD일"로 변환
      return response.data.data.map((item) => {
        const date = new Date(item.createdAt);
        const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

        return {
          nickname: item.nickname,
          score: item.score,
          ranking: item.ranking,
          createdAt: formattedDate,
        };
      });
    } else {
      throw new Error(response.data.message || '랭킹 데이터를 불러오는데 실패했습니다.');
    }
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};

export default fetchRankingList2;
