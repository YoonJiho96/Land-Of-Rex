package com.landofrex.user.controller;


import com.landofrex.security.AuthenticationUtil;
import com.landofrex.security.jwt.service.JwtService;
import com.landofrex.security.jwt.token.AccessToken;
import com.landofrex.security.jwt.token.TokenType;
import com.landofrex.user.AuthService;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthService authService;

    @GetMapping("/email")
    public ResponseEntity<String> getEmail(HttpServletRequest request) {
        AccessToken accessToken = (AccessToken) jwtService.extractByTokenType(request.getCookies(), TokenType.ACCESS)
                .orElseThrow(NoSuchElementException::new);

        String email=jwtService.extractEmail(jwtService.verifyToken(accessToken))
                .orElseThrow(()->new NoSuchElementException("can not get email"));

        return ResponseEntity.status(HttpStatus.OK).body(email);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.findAll());
    }

    @PostMapping("/sign-up")
    public ResponseEntity<Void> signUp(@Valid @RequestBody UserSignUpDto userSignUpDto) {
        User user= AuthenticationUtil.getUser();
        authService.OAuthSignUp(userSignUpDto,user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        jwtService.setAccessTokenExpired(response);
        jwtService.setRefreshTokenExpired(response);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
