package com.landofrex.post.controller;

import lombok.Builder;


public record PostUpdateRequest(Long postId, String title, String content) {

    @Builder
    public PostUpdateRequest {
    }
}
