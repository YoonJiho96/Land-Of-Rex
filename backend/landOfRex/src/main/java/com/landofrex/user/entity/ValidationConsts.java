package com.landofrex.user.entity;

public class ValidationConsts {
    public static final int USERNAME_MIN_LENGTH = 4;
    public static final int USERNAME_MAX_LENGTH = 12;

    public static final int NICKNAME_MIN_LENGTH = 2;
    public static final int NICKNAME_MAX_LENGTH = 10;

    public static final String USERNAME_SIZE_MESSAGE =
            "아이디는 " + USERNAME_MIN_LENGTH + "자 이상 " + USERNAME_MAX_LENGTH + "자 이하여야 합니다";

    public static final String PASSWORD_SIZE_MESSAGE =
            "비밀번호는 " + USERNAME_MIN_LENGTH + "자 이상 " + USERNAME_MAX_LENGTH + "자 이하여야 합니다";

    public static final String NICKNAME_MESSAGE =
            "닉네임은 " + NICKNAME_MIN_LENGTH + "자 이상 " + NICKNAME_MAX_LENGTH + "자 이하여야 합니다";

}