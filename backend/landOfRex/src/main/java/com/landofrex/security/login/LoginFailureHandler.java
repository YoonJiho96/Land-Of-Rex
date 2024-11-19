package com.landofrex.security.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.landofrex.exception.ErrorResponse;
import com.landofrex.response.SuccessResponse;
import com.landofrex.user.controller.NicknameDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
//        response.getWriter().write("로그인 실패! 아이디나 비밀번호를 확인해주세요.");
        objectMapper.writeValue(response.getWriter(), new ErrorResponse("LOGIN_FAIL","로그인 실패! 아이디나 비밀번호를 확인해주세요."));

        log.info("로그인에 실패했습니다. 메시지 : {}", exception.getMessage());
    }
}
