export const setRole = (role) => {
  localStorage.setItem('userRole', role); // 역할 저장
};

export const getRole = () => {
  return localStorage.getItem('userRole') || ''; // 역할 가져오기
};

export const clearRole = () => {
  localStorage.removeItem('userRole'); // 역할 제거
};
