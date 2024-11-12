package com.landofrex.exception;

public class NicknameInvalidException extends RuntimeException {
    public NicknameInvalidException(String nickname) {
        super("닉네임은 2-10자의 한글, 영문, 숫자만 사용 가능합니다: " + nickname);
    }
}
