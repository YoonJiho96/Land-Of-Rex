package com.landofrex.security.login;

import com.landofrex.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginSuccessDto {
    private String nickname;
    private Long userId;
    public LoginSuccessDto(User user) {
        this.nickname = user.getNickname();
        this.userId = user.getId();
    }
}
