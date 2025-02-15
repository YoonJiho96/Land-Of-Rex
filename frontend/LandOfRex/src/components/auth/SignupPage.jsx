import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config/url';
import NavBar from '../navBar/NavBar';
import './SignupPage.css'
import Swal from 'sweetalert2';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  const [validations, setValidations] = useState({
    username: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' },
    nickname: { isValid: false, message: '' }
  });

  const [isChecked, setIsChecked] = useState({
    username: false,
    nickname: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'username' || name === 'nickname') {
      setIsChecked(prev => ({
        ...prev,
        [name]: false
      }));
    }

    validateField(name, value);
  };

  const NICKNAME_REGEX = /^(?=.*[a-zA-Z가-힣0-9])(?!(.*[ㄱ-ㅎ]{2,}|.*[ㅏ-ㅣ]{2,}))[a-zA-Z0-9가-힣]{2,10}$/;

  const validateField = (name, value) => {
    let isValid = false;
    let message = '';

    switch (name) {
      case 'username':
        if (value.length === 0) {
          message = '아이디를 입력해주세요.';
        } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
          message = '아이디는 영문과 숫자만 사용 가능합니다.';
        } else if (value.length < 4 || value.length > 12) {
          message = '아이디는 4~12자 사이여야 합니다.';
        } else {
          isValid = true;
          message = '중복 확인이 필요합니다.';
        }
        break;

      case 'password':
        if (value.length === 0) {
          message = '비밀번호를 입력해주세요.';
        } else if (!/^[a-zA-Z0-9!@#$%^&*()]+$/.test(value)) {
          message = '비밀번호는 영문, 숫자, 특수문자(!@#$%^&*())만 사용 가능합니다.';
        } else if (value.length < 4 || value.length > 12) {
          message = '비밀번호는 4~12자 사이여야 합니다.';
        } else {
          isValid = true;
          message = '사용 가능한 비밀번호입니다.';
        }
        break;

      case 'confirmPassword':
        if (value.length === 0) {
          message = '비밀번호 확인을 입력해주세요.';
        } else if (value !== formData.password) {
          message = '비밀번호가 일치하지 않습니다.';
        } else {
          isValid = true;
          message = '비밀번호가 일치합니다.';
        }
        break;

      case 'nickname':
        if (value.length === 0) {
          message = '닉네임을 입력해주세요.';
        } else if (value.length < 2 || value.length > 10 || !NICKNAME_REGEX.test(value)) {
          message = '닉네임은 2~10자, 한글, 영문, 숫자만 사용 가능합니다.';
        } else {
          isValid = true;
          message = '중복 확인이 필요합니다.';
        }
        break;

      default:
        break;
    }

    setValidations(prev => ({
      ...prev,
      [name]: { isValid, message }
    }));
  };

  const checkDuplicate = async (field) => {
    try {
      let response;
      if (field === 'username') {
        response = await fetch(`${baseUrl}/api/v1/auth/username/exists`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: formData.username })
        });
      } else {
        response = await fetch(`${baseUrl}/api/v1/auth/nickname/${formData.nickname}/exists`, {
          method: 'GET'
        });
      }

      if (response.ok) {
        setValidations(prev => ({
          ...prev,
          [field]: { isValid: true, message: `사용 가능한 ${field === 'username' ? '아이디' : '닉네임'}입니다.` }
        }));
        setIsChecked(prev => ({
          ...prev,
          [field]: true
        }));
      } else {
        setValidations(prev => ({
          ...prev,
          [field]: { isValid: false, message: `이미 사용중인 ${field === 'username' ? '아이디' : '닉네임'}입니다.` }
        }));
        setIsChecked(prev => ({
          ...prev,
          [field]: false
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setValidations(prev => ({
        ...prev,
        [field]: { isValid: false, message: '중복 확인 중 오류가 발생했습니다.' }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모든 필드의 유효성과 중복 확인 체크
    if (
      !validations.username.isValid || 
      !validations.password.isValid || 
      !validations.confirmPassword.isValid || 
      !validations.nickname.isValid ||
      !isChecked.username || 
      !isChecked.nickname
    ) {
      alert('모든 필드를 올바르게 입력하고 중복 확인을 완료해주세요.');
      return;
    }
  
    const dataToSend = { ...formData };
    delete dataToSend.confirmPassword;
  
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
  
      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '회원가입이 완료되었습니다!',
          text: '로그인 페이지로 이동합니다.',
          confirmButtonText: '확인'
        }).then(() => {
          navigate('/login');
        });
      } else {
        const errorData = await response.json();
        console.error("Server response error:", errorData);
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };
    
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#333' }}>회원가입</h2>
        <NavBar activeSection="myPosts" sections={[]} />
        <form onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <input
                type="text"
                name="username"
                placeholder="아이디 (4~12자)"
                value={formData.username}
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: `1px solid ${validations.username.isValid ? '#4ade80' : '#ddd'}`,
                  borderRadius: '4px'
                }}
              />
              <button
                type="button"
                onClick={() => checkDuplicate('username')}
                disabled={!validations.username.isValid || isChecked.username}
                style={{
                  padding: '0px 4px', // 좌우 패딩만 설정
                  height: '40px', // 원하는 높이로 설정
                  lineHeight: 'normal', // 줄 높이를 'normal'로 설정
                  backgroundColor: validations.username.isValid && !isChecked.username ? '#3b82f6' : '#ddd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: validations.username.isValid && !isChecked.username ? 'pointer' : 'not-allowed',
                  boxSizing: 'border-box' // border-box로 설정하여 padding과 border가 포함되도록 함
                }}
              >
                중복확인
              </button>
            </div>
            <span style={{ fontSize: '12px', color: validations.username.isValid ? '#4ade80' : '#ef4444' }}>
              {validations.username.message}
            </span>
          </div>
          
          {/* 닉네임 입력 */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              <input
                type="text"
                name="nickname"
                placeholder="닉네임 (2~10자)"
                value={formData.nickname}
                onChange={handleChange}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: `1px solid ${validations.nickname.isValid ? '#4ade80' : '#ddd'}`,
                  borderRadius: '4px'
                }}
              />
              <button
                type="button"
                onClick={() => checkDuplicate('nickname')}
                disabled={!validations.nickname.isValid || isChecked.nickname}
                style={{
                  padding: '0px 4px',
                  height: '40px', // 원하는 높이로 설정
                  lineHeight: 'normal', // 줄 높이를 'normal'로 설정
                  backgroundColor: validations.nickname.isValid && !isChecked.nickname ? '#3b82f6' : '#ddd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: validations.nickname.isValid && !isChecked.nickname ? 'pointer' : 'not-allowed'
                }}
              >
                중복확인
              </button>
            </div>
            <span style={{ fontSize: '12px', color: validations.nickname.isValid ? '#4ade80' : '#ef4444' }}>
              {validations.nickname.message}
            </span>
          </div>

          {/* 비밀번호 입력 */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (4~12자)"
              value={formData.password}
              onChange={handleChange}
              style={{
                height: '25px', // 원하는 높이로 설정
                lineHeight: 'normal', // 줄 높이를 'normal'로 설정
                width: '95%',
                padding: '8px',
                border: `1px solid ${validations.password.isValid ? '#4ade80' : '#ddd'}`,
                borderRadius: '4px',
                marginBottom: '4px'
              }}
            />
            <span style={{ fontSize: '12px', color: validations.password.isValid ? '#4ade80' : '#ef4444' }}>
              {validations.password.message}
            </span>
          </div>

          {/* 비밀번호 확인 입력 */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                height: '25px', // 원하는 높이로 설정
                lineHeight: 'normal', // 줄 높이를 'normal'로 설정
                width: '95%',
                padding: '8px',
                border: `1px solid ${validations.confirmPassword.isValid ? '#4ade80' : '#ddd'}`,
                borderRadius: '4px',
                marginBottom: '4px'
              }}
            />
            <span style={{ fontSize: '12px', color: validations.confirmPassword.isValid ? '#4ade80' : '#ef4444' }}>
              {validations.confirmPassword.message}
            </span>
          </div>


          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            가입하기
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            로그인으로 돌아가기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
