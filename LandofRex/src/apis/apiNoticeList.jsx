import axios from 'axios';

const apiUrl = 'https://k11e102.p.ssafy.io/api/v1/notices?page=0&size=10';

// 중요도에 따른 우선순위 설정
const importanceOrder = {
  URGENT: 1,
  HIGH: 2,
  NORMAL: 3,
};

// 공지사항 목록 요청 함수
export const fetchNoticeList = async () => {
  try {
    const response = await axios.get(apiUrl);
    const { notices } = response.data;

    // 날짜 변환 및 정렬
    const sortedNotices = notices
      .map((notice) => {
        const date = new Date(notice.createdAt);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        return {
          title: notice.title,
          createdAt: formattedDate,
          importance: notice.importance,
        };
      })
      .sort((a, b) => {
        // 날짜 순으로 정렬 (내림차순)
        const dateComparison = new Date(b.createdAt) - new Date(a.createdAt);

        // 날짜가 같은 경우 importance 순으로 정렬
        if (dateComparison === 0) {
          return importanceOrder[a.importance] - importanceOrder[b.importance];
        }

        return dateComparison;
      });

    return sortedNotices;
  } catch (error) {
    console.error('공지사항 데이터를 불러오는데 실패했습니다:', error);
    throw error;
  }
};

export default fetchNoticeList;