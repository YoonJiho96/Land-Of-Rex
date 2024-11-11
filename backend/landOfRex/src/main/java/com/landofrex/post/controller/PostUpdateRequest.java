package com.landofrex.post.controller;

import com.landofrex.post.entity.PostType;
import lombok.Builder;
import lombok.Getter;

import java.util.List;


public record PostUpdateRequest(Long postId, String title, String content, PostType postType, List<ImageOrder> imageOrders, List<ImageOrder> newImageOrders ) {

    @Builder
    public PostUpdateRequest {
    }

    @Getter
    public static class ImageOrder{
        private Long id;
        private Integer sequence;
    }
}
