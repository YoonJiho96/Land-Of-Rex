package com.landofrex.user.controller;


import com.google.protobuf.Api;
import com.landofrex.response.ApiResponse;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.security.jwt.service.JwtService;
import com.landofrex.user.AuthService;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/email")
    public ResponseEntity<String> getEmail(HttpServletRequest request) {

        String email=AuthenticationUtil.getUser().getEmail();

        return ResponseEntity.status(HttpStatus.OK).body(email);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.status(HttpStatus.OK).body(userRepository.findAll());
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signUp(@Valid @RequestBody UserSignUpDto userSignUpDto) {
        authService.signUp(userSignUpDto);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PostMapping("/username/exists")
    public ResponseEntity<ApiResponse<String>> checkUsernameExists(@RequestBody UsernameDto usernameDto) {
        authService.checkUsernameExists(usernameDto.getUsername());
        return ResponseEntity.ok(ApiResponse.success(usernameDto.getUsername()));
    }

    @GetMapping("/nickname/{nickname}/exists")
    public ResponseEntity<ApiResponse<String>> checkNickname(@PathVariable String nickname) {
        authService.checkNicknameExists(nickname);
        return ResponseEntity.ok(ApiResponse.success(nickname));
    }

    @PostMapping("/signup/oauth")
    public ResponseEntity<Void> signUpOauth(@Valid @RequestBody UserOauthSignUpDto userOauthSignUpDto) {
        User user= AuthenticationUtil.getUser();
        authService.OAuthSignUp(userOauthSignUpDto,user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        jwtService.setAccessTokenExpired(response);
        jwtService.setRefreshTokenExpired(response);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @PostMapping("/password/find")
    public ResponseEntity<ApiResponse<String>> findPassword(@RequestBody UsernameDto usernameDto){
        User user=userRepository.findByUsername(usernameDto.getUsername()).orElseThrow(()->new UsernameNotFoundException(usernameDto.getUsername()));
        return ResponseEntity.ok(ApiResponse.success(user.getPassword()));
    }
}
