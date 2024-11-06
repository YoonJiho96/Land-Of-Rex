package com.landofrex.user.controller;

import com.landofrex.user.entity.ValidationConsts;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserSignUpDto(
        @NotBlank(message = "닉네임은 필수 입력값입니다")
        @Size(min = 2, max = 10, message = ValidationConsts.NICKNAME_MESSAGE)
        String nickname,

        @NotBlank(message = "비밀번호를 입력하세요")
        @Size(min = 4, max = 12, message = "비밀번호는 4자 이상 12자 이하여야 합니다")
        String password,

        @NotBlank(message = "아이디를 입력하세요")
        @Size(min = 4, max = 12, message = "아이디는 4자 이상 12자 이하여야 합니다")
        String username) {
}
