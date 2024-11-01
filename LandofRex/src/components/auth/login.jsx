import React from 'react';
import { baseUrl } from '/src/config/url.js';

const OAuthLogin = () => {

  const loginWith = (provider) => {
    const redirectUrl = `${baseUrl}/oauth2/authorization/${provider}`;
    window.location.href = redirectUrl;
  };

  return (
    <div>
      <h2>Login with OAuth2</h2>
      <a href="#kakao" onClick={() => loginWith('kakao')}>Kakao Login</a><br />
      <a href="#google" onClick={() => loginWith('google')}>Google Login</a><br />
      <a href="#naver" onClick={() => loginWith('naver')}>Naver Login</a><br />
    </div>
  );
};

export default OAuthLogin;
