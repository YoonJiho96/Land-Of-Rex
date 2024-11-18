import axios from 'axios';

const apiAdminLogin = async (username, password) => {
    try {
        const response = await axios.post('https://k11e102.p.ssafy.io/api/v1/auth/login', {
            username,
            password
        });

        return response.data;  // 성공 시 응답 데이터 반환
    } catch (error) {
        console.error('로그인 실패:', error);
        return null;  // 실패 시 null 반환
    }
};

export default apiAdminLogin;
