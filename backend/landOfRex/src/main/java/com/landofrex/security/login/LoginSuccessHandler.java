package com.landofrex.security.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.landofrex.game.ranking.dto.StageProgressDto;
import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.game.ranking.service.RankingService;
import com.landofrex.response.SuccessResponse;
import com.landofrex.security.jwt.CustomUserDetails;
import com.landofrex.security.jwt.service.JwtService;
import com.landofrex.security.jwt.token.AccessToken;
import com.landofrex.security.jwt.token.RefreshToken;
import com.landofrex.user.controller.NicknameDto;
import com.landofrex.user.controller.UsernameDto;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Component
public class LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final RankingService rankingService;

    @Value("${jwt.access.expiration}")
    private String accessTokenExpiration;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException{
        CustomUserDetails userDetails=(CustomUserDetails)authentication.getPrincipal();
        User user= userDetails.getUser();
        AccessToken accessToken = jwtService.createAccessToken(user.getUsername(),user.getId()); // JwtService의 createAccessToken을 사용하여 AccessToken 발급
        RefreshToken refreshToken = jwtService.createRefreshToken(user.getId()); // JwtService의 createRefreshToken을 사용하여 RefreshToken 발급

        jwtService.setAccessAndRefreshToken(response, accessToken, refreshToken); // 응답 헤더에 AccessToken, RefreshToken 실어서 응답

        user.updateRefreshToken(refreshToken);
        userRepository.save(user);

        StageProgressDto progress= rankingService.getStageProgress(user.getId());

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), SuccessResponse.of(new LoginSuccessDto(user,progress)));

        log.info("로그인에 성공하였습니다. 아이디 : {}", user.getUsername());
        log.info("로그인에 성공하였습니다. AccessToken : {}", accessToken);
        log.info("발급된 AccessToken 만료 기간 : {}", accessTokenExpiration);
    }
}