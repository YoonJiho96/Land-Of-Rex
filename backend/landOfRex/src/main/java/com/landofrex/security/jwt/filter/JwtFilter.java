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
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.core.authority.mapping.NullAuthoritiesMapper;
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

    private final GrantedAuthoritiesMapper authoritiesMapper = new NullAuthoritiesMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        log.info("RequestURI:{}",request.getRequestURI());

        // 쿠키에서 accessToken 추출
        Optional<Token> accessToken = jwtService.extractByTokenType(request.getCookies(), TokenType.ACCESS);
        // AccessToken 검사 및 인증 처리
        if (accessToken.isPresent()) {
            DecodedJWT decodedAccessToken =jwtService.verifyToken(accessToken.get());
            User user=userRepo.findById(jwtService.extractUserId(decodedAccessToken))
                    .orElseThrow(()->new NoSuchElementException("user not found"));
            AuthenticationUtil.saveAuthentication(user);
            filterChain.doFilter(request, response);
            return;
        }else{
            log.debug("after valid check accessToken is empty");
        }

        // RefreshToken을 검사(유효한 AccessToken 없는 경우)
        Optional<Token> refreshToken = jwtService.extractByTokenType(request.getCookies(), TokenType.REFRESH);

        // 리프레시 토큰이 유효하면, AccessToken 재발급
        if (refreshToken.isPresent()) {
            DecodedJWT decodedRefreshToken=jwtService.verifyToken(refreshToken.get());
            User user=userRepo.findById(jwtService.extractUserId(decodedRefreshToken))
                    .orElseThrow(()->new NoSuchElementException("user not found"));

            jwtService.processTokens(response,user);
            AuthenticationUtil.saveAuthentication(user);

            filterChain.doFilter(request, response);
            return;
        }

        filterChain.doFilter(request, response); // AccessToken 및 RefreshToken이 유효하지 않다면, 다음 필터로 넘어감
    }
}
