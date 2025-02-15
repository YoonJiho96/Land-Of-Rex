package com.landofrex.user.entity;


import com.landofrex.security.jwt.token.RefreshToken;
import com.landofrex.user.controller.UserSignUpDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;


@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "users")
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Size(min = ValidationConsts.USERNAME_MIN_LENGTH, max = ValidationConsts.USERNAME_MAX_LENGTH, message = ValidationConsts.USERNAME_SIZE_MESSAGE)
    @Column(nullable = false, length = ValidationConsts.USERNAME_MAX_LENGTH)
    private String username;

    @Column(length = 30)
    private String email; // 이메일

    @Column(nullable = false, length = 60)
    private String password; // 비밀번호

    @Size(min = ValidationConsts.NICKNAME_MIN_LENGTH, max = ValidationConsts.NICKNAME_MAX_LENGTH, message = ValidationConsts.NICKNAME_MESSAGE)
    @Column(nullable = false, length = ValidationConsts.NICKNAME_MAX_LENGTH)
    private String nickname; // 닉네임

    @Column(length = 100)
    private String imageUrl; // 프로필 이미지

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private SocialType socialType; // KAKAO, NAVER, GOOGLE

    @Column(length = 100)
    private String socialId; // 로그인한 소셜 타입의 식별자 값

    private String refreshToken; // 리프레시 토큰


    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 수정 시점에 자동으로 호출되어 updatedAt을 설정
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 유저 권한 설정 메소드
    public void updateRoleToUser() {
        this.role = Role.USER;
    }

    // 비밀번호 암호화 메소드
    public void resetPassword(PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(this.username);
    }

    //== 유저 필드 업데이트 ==//
    public void updateNickname(String updateNickname) {
        this.nickname = updateNickname;
    }

    public void updatePassword(String updatePassword, PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(updatePassword);
    }

    public void updateRefreshToken(RefreshToken updateRefreshToken) {
        this.refreshToken = updateRefreshToken.getTokenValue();
    }

    public User(UserSignUpDto userSignUpDto) {
        this.nickname= userSignUpDto.nickname();
        this.username= userSignUpDto.username();
        this.password = userSignUpDto.password();
        this.role = Role.USER;
    }
}

