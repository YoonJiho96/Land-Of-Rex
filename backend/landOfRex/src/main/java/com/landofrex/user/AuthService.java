package com.landofrex.user;


import com.landofrex.user.controller.UserOauthSignUpDto;
import com.landofrex.user.controller.UserSignUpDto;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private static final int NICKNAME_MIN_LENGTH = 2;
    // 닉네임의 유효성을 확인하기 위한 정규 표현식
    private static final String NICKNAME_REGEX = "^(?=.*[a-zA-Z가-힣0-9])(?!(.*[ㄱ-ㅎ]{2,}|.*[ㅏ-ㅣ]{2,}))[a-zA-Z0-9가-힣]{2,12}$";
    private static final Pattern NICKNAME_PATTERN = Pattern.compile(NICKNAME_REGEX);


    public void OAuthSignUp(UserOauthSignUpDto userOauthSignUpDto, User user) {

        valiateNickname(userOauthSignUpDto.nickname());

        userRepository.findByNickname(userOauthSignUpDto.nickname()).ifPresent(userAlready -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname already exists");
        });

        //ROLE.USER인지 이미 필터에서 확인

        user.updateNickname(userOauthSignUpDto.nickname());
        user.updateRoleToUser();

        userRepository.save(user);
    }

    public void signUp(UserSignUpDto userSignUpDto) {
        valiateNickname(userSignUpDto.nickname());

        userRepository.findByNickname(userSignUpDto.nickname()).ifPresent(userAlready -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nickname already exists");
        });

        userRepository.save(new User(userSignUpDto));

    }

    private void valiateNickname(String nickname) {
        if (NICKNAME_PATTERN.matcher(nickname).matches()) {
            return;
        }else{
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid nickname");
        }
    }
}
