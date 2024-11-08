package com.landofrex.notice.controller;

import com.landofrex.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSimpleResponse {
    private final Long id;
    private final String nickname;

    public UserSimpleResponse(User user) {
        this.id = user.getId();
        this.nickname = user.getNickname();
    }
}