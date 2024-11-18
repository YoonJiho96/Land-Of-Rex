// src/utils/dateFormatter.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';

// 플러그인 및 기본 설정
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');
dayjs.tz.setDefault('Asia/Seoul');

// 자주 사용하는 포맷
export const DATE_FORMATS = {
  FULL: 'YYYY년 MM월 DD일 HH:mm:ss',
  DATE_ONLY: 'YYYY년 MM월 DD일',
  TIME_ONLY: 'HH:mm:ss',
  YEAR_MONTH: 'YYYY년 MM월',
};

// 기본 날짜 포맷팅
export const formatDate = (date, format = DATE_FORMATS.FULL) => {
  return dayjs(date).format(format);
};

// 상대적 시간 표시 (예: '3시간 전')
export const formatRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

// UTC -> 한국 시간 변환
export const formatKoreanTime = (date) => {
  if (!date) return '-';
  
  return dayjs(date)
    .add(9, 'hour')  // UTC에서 한국 시간으로 변환 (UTC+9)
    .format(DATE_FORMATS.FULL);
};

// 날짜 비교 함수
export const isAfter = (date1, date2) => {
  return dayjs(date1).isAfter(date2);
};

export const isBefore = (date1, date2) => {
  return dayjs(date1).isBefore(date2);
};

// dayjs 인스턴스 직접 사용이 필요한 경우
export const getDateInstance = (date) => {
  return dayjs(date);
};