package com.landofrex.user.controller;


import jakarta.validation.constraints.NotBlank;

public record UserSignUpDto(@NotBlank(message = "nickname blank exception") String nickname) {
}
