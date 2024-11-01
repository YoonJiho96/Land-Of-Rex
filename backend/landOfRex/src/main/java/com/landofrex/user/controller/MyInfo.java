package com.landofrex.user.controller;


import com.landofrex.user.entity.User;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyInfo {
    private final String email;
    private final String nickname;
    private final LocalDateTime registerAt;
    public MyInfo(User user){
        this.email=user.getEmail();
        this.nickname=user.getNickname();
        this.registerAt=user.getCreatedAt();
    }
}
