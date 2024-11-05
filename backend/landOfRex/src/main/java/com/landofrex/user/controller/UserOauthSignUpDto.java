package com.landofrex.user.controller;


import jakarta.validation.constraints.NotBlank;

public record UserOauthSignUpDto(@NotBlank(message = "nickname blank exception") String nickname) {
}
