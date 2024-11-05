package com.landofrex.user.controller;

import jakarta.validation.constraints.NotBlank;

public record UserSignUpDto(@NotBlank(message = "nickname blank exception")String nickname,
                            @NotBlank(message = "password blank exception")String password,
                            @NotBlank(message = "username blank exception")String username) {
}
