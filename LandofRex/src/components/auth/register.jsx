import React, { useEffect, useState } from 'react';
import { baseUrl } from '/src/config/url.js';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorName, setErrorName] = useState('');

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = async () => {
    try {
      console.log(baseUrl)
      const response = await fetch(`${baseUrl}/api/v1/auth/email`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch email');
      const email = await response.text();
      setEmail(email);
    } catch (error) {
      
      console.error('Error:', error);
      setEmail('Error loading email');
    }
  };

  const handleSignUp = async () => {
    const user = {
      nickname: name,
      email: email,
    };

    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/sign-up`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      setErrorEmail('');
      setErrorName('');

      if (response.status === 200) {
        alert('회원가입이 완료되었습니다');
        window.location.href = '/';
      } else if (response.status === 409) {
        const errorText = await response.text();
        alert(errorText);
      } else if (response.status === 400) {
        const errors = await response.json();
        if (errors.email) setErrorEmail(errors.email);
        if (errors.name) setErrorName(errors.name);
      } else {
        alert('회원가입에 실패하였습니다');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
      <div className="py-5 text-center">
        <h2>회원 가입</h2>
      </div>
      <h4 className="mb-3">회원 정보 입력</h4>
      <form id="signupForm">
        <div>
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" className="form-control" value={email} readOnly />
          <p style={{ color: 'red' }}>{errorEmail}</p>
        </div>
        <div>
          <label htmlFor="name">닉네임</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p style={{ color: 'red' }}>{errorName}</p>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col">
            <button type="button" className="w-100 btn btn-primary btn-lg" onClick={handleSignUp}>
              회원가입
            </button>
          </div>
          <div className="col">
            <button type="button" className="w-100 btn btn-secondary btn-lg" onClick={() => (window.location.href = '/')}>
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
