import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { baseUrl } from '../config/url';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // 인증 상태 확인 함수
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/my/info`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
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
  }, []);

  // 로그인 함수
  const login = async (loginData) => {
    const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loginData)
    });

    if (response.ok) {
      await checkAuthStatus();
      return true;
    }
    throw new Error('Login failed');
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

  const isAuthor = (authorNickname) => {
    // console.log('isAuthor:', user, authorNickname);
    return user && user.nickname === authorNickname;
  };

  // 컴포넌트 마운트와 라우트 변경 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]); // 페이지 변경 시마다 상태 체크

  const contextValue = {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuthStatus,
    isAuthor
  };

  if (isLoading && !isLoggedIn) {
    return <div>Loading...</div>;
  }


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;