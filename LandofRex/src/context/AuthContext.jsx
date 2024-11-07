// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { baseUrl } from '../config/url';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 추가

  // 인증 상태 확인 함수
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/my/info`, {
        credentials: 'include',  // 쿠키를 포함하여 요청을 보냄
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = async (loginData) => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // 쿠키를 받기 위해 필요
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setIsLoggedIn(true);
      setUser(data.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 로딩 중일 때 로딩 표시
  if (isLoading) {
    return <div>Loading...</div>;  // 또는 로딩 스피너 컴포넌트
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout,
      checkAuthStatus  // 필요한 경우 상태 리프레시를 위해 노출
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;