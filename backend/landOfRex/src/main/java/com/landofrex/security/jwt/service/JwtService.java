package com.landofrex.security.jwt.service;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.landofrex.security.jwt.token.*;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Getter
@Slf4j
@Transactional
public class JwtService {

    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.access.expiration}")
    private Long accessTokenExpirationPeriod;

    @Value("${jwt.refresh.expiration}")
    private Long refreshTokenExpirationPeriod;

    @Value("${jwt.access.header}")
    private String accessHeader;

    @Value("${jwt.refresh.header}")
    private String refreshHeader;

    public static final String BEARER = "Bearer ";

    private final UserRepository userRepo;

    /**
     * AccessToken 생성 메소드
     */
    public AccessToken createAccessToken(String email, Long userId) {
        Date now = new Date();
        return new AccessToken(JWT.create() // JWT 토큰을 생성하는 빌더 반환
                .withSubject(userId.toString())
                .withExpiresAt(new Date(now.getTime() + accessTokenExpirationPeriod)) // 토큰 만료 시간 설정
                .withClaim(Claim.EMAIL.name(), email)
                .withClaim(Claim.USER_ID.name(), userId)
                .withClaim(Claim.TOKEN_TYPE.name(), TokenType.ACCESS.name())
                .sign(Algorithm.HMAC512(secretKey)));
                //secret 키로 yml 파일에 보관
    }

    /**
     * RefreshToken 생성
     * RefreshToken은 Claim에 email도 넣지 않으므로 withClaim() X
     */
    public RefreshToken createRefreshToken(Long userId) {
        Date now = new Date();
        return new RefreshToken(JWT.create()
                .withSubject(userId.toString())
                .withClaim(Claim.USER_ID.name(), userId)
                .withExpiresAt(new Date(now.getTime() + refreshTokenExpirationPeriod))
                .withClaim(Claim.TOKEN_TYPE.name(),TokenType.REFRESH.name())
                .sign(Algorithm.HMAC512(secretKey)));
    }

    public void processTokens(HttpServletResponse response, User user){
        AccessToken reIssuedAccessToken=reIssueAccessToken(user);
        RefreshToken reIssuedRefreshToken=reIssueRefreshToken(user);

        user.updateRefreshToken(reIssuedRefreshToken);
        userRepo.save(user);

        setAccessAndRefreshToken(response,reIssuedAccessToken,reIssuedRefreshToken);
    }
    private RefreshToken reIssueRefreshToken(User user) {
        RefreshToken reIssuedRefreshToken = createRefreshToken(user.getId());
        log.info("reIssueRefreshToken in jwtFilter");
        return reIssuedRefreshToken;
    }

    private AccessToken reIssueAccessToken(User user) {
        AccessToken reIssuedAccessToken=createAccessToken(user.getEmail(), user.getId());
        return reIssuedAccessToken;
    }

    /**
     * AccessToken 헤더에 실어서 보내기
     */
    public void sendAccessTokenHeader(HttpServletResponse response, String accessToken) {
        response.setStatus(HttpServletResponse.SC_OK);

        response.setHeader(accessHeader, accessToken);
        log.info("재발급된 Access Token : {}", accessToken);
    }

    /**
     * AccessToken + RefreshToken 헤더에 실어서 보내기
     */
    public void setAccessAndRefreshToken(HttpServletResponse response, AccessToken accessToken, RefreshToken refreshToken) {
        response.setStatus(HttpServletResponse.SC_OK);

        setAccessTokenCookie(response, accessToken);
        setRefreshTokenCookie(response, refreshToken);
        log.info("Access Token, Refresh Token 쿠키 설정 완료");
    }

    /**
     * 헤더에서 RefreshToken 추출
     * 토큰 형식 : Bearer XXX에서 Bearer를 제외하고 순수 토큰만 가져오기 위해서
     * 헤더를 가져온 후 "Bearer"를 삭제(""로 replace)
     */
    public Optional<String> extractRefreshToken(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader(refreshHeader))
                .filter(refreshToken -> refreshToken.startsWith(BEARER))
                .map(refreshToken -> refreshToken.replace(BEARER, ""));
    }


    public Optional<Token> extractByTokenType(Cookie[] cookies, TokenType tokenType) {
        if(cookies==null) return Optional.empty();

        for (Cookie cookie : cookies) {
            if(tokenType.name().equals(cookie.getName())){
                return Optional.of(switchByType(cookie.getValue(), tokenType));
            }
        }
        log.debug("Cookie:{} is empty", tokenType.name());
        return Optional.empty();
    }

    public Token switchByType(String value, TokenType tokenType) {
        switch (tokenType) {
            case ACCESS:
                return new AccessToken(value);
            case REFRESH:
                return new RefreshToken(value);
            default:
                throw new IllegalArgumentException("Invalid TokenType: " + tokenType);
        }
    }


    private void setAccessTokenCookie(HttpServletResponse response, AccessToken accessToken) {
        Cookie cookie = new Cookie(TokenType.ACCESS.name(), accessToken.getTokenValue());
        cookie.setHttpOnly(true); // XSS 공격 방지
        // cookie.setSecure(true);   // HTTPS에서만 전송되도록 설정
        cookie.setPath("/");      // 쿠키의 유효 경로 설정
        cookie.setMaxAge(3600); // 7일 유효 기간 설정
        // cookie.setDomain(".p.ssafy.io");
        // cookie.setAttribute("SameSite","None");
        response.addCookie(cookie);
    }


    private void setRefreshTokenCookie(HttpServletResponse response, RefreshToken refreshToken) {
        Cookie cookie = new Cookie(TokenType.REFRESH.name(), refreshToken.getTokenValue());
        cookie.setHttpOnly(true); // XSS 공격 방지
        // cookie.setSecure(true);   // HTTPS에서만 전송되도록 설정
        cookie.setPath("/");      // 쿠키의 유효 경로 설정
        cookie.setMaxAge(172800); // 7일 유효 기간 설정
        // cookie.setDomain(".p.ssafy.io");
        // cookie.setAttribute("SameSite","None");
        response.addCookie(cookie);
    }


    public void setAccessTokenExpired(HttpServletResponse response) {
        Cookie cookie = new Cookie(TokenType.ACCESS.name(), null);
        cookie.setHttpOnly(true); // XSS 공격 방지
        // cookie.setSecure(true);   // HTTPS에서만 전송되도록 설정
        cookie.setPath("/");      // 쿠키의 유효 경로 설정
        cookie.setMaxAge(0); // 7일 유효 기간 설정
        // cookie.setAttribute("SameSite","None");
        response.addCookie(cookie);
    }

    public void setRefreshTokenExpired(HttpServletResponse response) {
        Cookie cookie = new Cookie(TokenType.REFRESH.name(), null);
        cookie.setHttpOnly(true); // XSS 공격 방지
        // cookie.setSecure(true);   // HTTPS에서만 전송되도록 설정
        cookie.setPath("/");      // 쿠키의 유효 경 로 설정
        cookie.setMaxAge(0); // 7일 유효 기간 설정
//        cookie.setSameSite("Strict"); // CSRF 방지
        // cookie.setAttribute("SameSite","None");
        response.addCookie(cookie);
    }

    /**
     * RefreshToken DB 저장(업데이트)
     */
    public void updateRefreshToken(Long userId, RefreshToken refreshToken) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("일치하는 회원이 없습니다."));
        user.updateRefreshToken(refreshToken);
    }

    public DecodedJWT verifyToken(Token token) {
        try {
            // JWT 서명 알고리즘 설정
            Algorithm algorithm = Algorithm.HMAC512(secretKey);

            return JWT.require(algorithm)
                    .build() // 검증기 생성
                    .verify(token.getTokenValue()); // 검증 성공 시 DecodedJWT 반환
        }catch(TokenExpiredException expiredException){
               expiredException.printStackTrace();
               return null;
        }catch (JWTVerificationException tokenVerificationException) {
            // 검증 실패 처리
            tokenVerificationException.printStackTrace();
            return null;
        }
    }

    // userId 추출 메소드
    public Long extractUserId(DecodedJWT decodedJWT) {
        if (decodedJWT != null) {
            // "userId" 클레임에서 Long 타입의 userId 추출
            return Long.valueOf(decodedJWT.getSubject());
        }
        // null일 경우 예외 처리 혹은 적절한 값을 반환
        throw new IllegalArgumentException("DecodedJWT cannot be null");
    }

    public Optional<String> extractEmail(DecodedJWT decodedJWT){
        if (decodedJWT != null) {
            return Optional.of(decodedJWT.getClaim(Claim.EMAIL.name()).asString());
        }
        return Optional.empty();
    }

}
