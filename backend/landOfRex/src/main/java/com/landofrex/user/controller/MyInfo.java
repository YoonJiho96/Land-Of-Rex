package com.landofrex.user.controller;


import com.landofrex.user.entity.User;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyInfo {

    private final String nickname;

    public MyInfo(User user){
        this.nickname=user.getNickname();
    }
}
