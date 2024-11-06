package com.landofrex.security.jwt.filter;



import com.auth0.jwt.interfaces.DecodedJWT;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.security.jwt.service.JwtService;
import com.landofrex.security.jwt.token.Token;
import com.landofrex.security.jwt.token.TokenType;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.NoSuchElementException;
import java.util.Optional;

/**
 * Jwt 인증 필터
 * "/login" 이외의 URI 요청이 왔을 때 처리하는 필터
 *
 * 기본적으로 사용자는 요청 헤더에 AccessToken만 담아서 요청
 * AccessToken 만료 시에만 RefreshToken을 요청 헤더에 AccessToken과 함께 요청
 *
 * 1. RefreshToken이 없고, AccessToken이 유효한 경우 -> 인증 성공 처리, RefreshToken을 재발급하지는 않는다.
 * 2. RefreshToken이 없고, AccessToken이 없거나 유효하지 않은 경우 -> 인증 실패 처리, 403 ERROR
 * 3. RefreshToken이 있는 경우 -> DB의 RefreshToken과 비교하여 일치하면 AccessToken 재발급, RefreshToken 재발급(RTR 방식)
 *                              인증 성공 처리 필터 통과 controller 정상 작동
 *
 */
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepo;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().equals("/api/v1/auth/sign-up") &&
                request.getMethod().equals("POST");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        log.info("RequestURI:{}",request.getRequestURI());

        if(request.getRequestURI().equals("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<Token> accessToken = jwtService.extractByTokenType(request.getCookies(), TokenType.ACCESS);
        if (accessToken.isPresent()) {
            DecodedJWT decodedAccessToken =jwtService.verifyToken(accessToken.get())
                    .orElseThrow(()->new BadCredentialsException("Not Valid Access Token"));

            User user=userRepo.findById(jwtService.extractUserId(decodedAccessToken))
                    .orElseThrow(()->new NoSuchElementException("user not found"));
            AuthenticationUtil.saveAuthentication(user);
            filterChain.doFilter(request, response);
            return;
        }else{
            // RefreshToken을 검사(유효한 AccessToken 없는 경우)
            Optional<Token> refreshToken = jwtService.extractByTokenType(request.getCookies(), TokenType.REFRESH);
            if (refreshToken.isPresent()) {
                DecodedJWT decodedRefreshToken=jwtService.verifyToken(refreshToken.get())
                        .orElseThrow(()->new BadCredentialsException("Not Valid Refresh Token"));
                User user=userRepo.findById(jwtService.extractUserId(decodedRefreshToken))
                        .orElseThrow(()->new NoSuchElementException("user not found"));

                jwtService.processTokens(response,user);
                AuthenticationUtil.saveAuthentication(user);

                filterChain.doFilter(request, response);
                return;
            }
        }

        filterChain.doFilter(request, response); // AccessToken 및 RefreshToken이 유효하지 않다면, 다음 필터로 넘어감
    }
}
