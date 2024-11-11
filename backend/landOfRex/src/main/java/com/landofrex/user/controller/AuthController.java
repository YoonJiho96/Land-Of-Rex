package com.landofrex.user.controller;


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
    public ResponseEntity<Void> signUp(@Valid @RequestBody UserSignUpDto userSignUpDto) {
        authService.signUp(userSignUpDto);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/username/exists")
    public ResponseEntity<String> checkUsernameExists(@RequestBody UsernameDto usernameDto) {
        authService.checkUsernameExists(usernameDto.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(usernameDto.getUsername());
    }

    @GetMapping("/nickname/{nickname}/exists")
    public ResponseEntity<String> checkNickname(@PathVariable String nickname) {
        authService.checkNicknameExists(nickname);
        return ResponseEntity.status(HttpStatus.OK).body(nickname);
    }

    @PostMapping("/signup/oauth")
    public ResponseEntity<Void> signUpOauth(@Valid @RequestBody UserOauthSignUpDto userOauthSignUpDto) {
        User user= AuthenticationUtil.getUser();
        authService.OAuthSignUp(userOauthSignUpDto,user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        jwtService.setAccessTokenExpired(response);
        jwtService.setRefreshTokenExpired(response);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody UsernameDto usernameDto){
        User user=userRepository.findByUsername(usernameDto.getUsername()).orElseThrow(()->new UsernameNotFoundException(usernameDto.getUsername()));
        user.resetPassword(passwordEncoder);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
