package com.landofrex.post.controller;

import com.landofrex.post.entity.PostType;
import lombok.Builder;
import lombok.Getter;

import java.util.List;


public record PostUpdateRequest(Long postId, String title, String content, PostType postType, ImageSeqInfo imageSeqInfo) {

    @Builder
    public PostUpdateRequest {
    }

    @Getter
    public static class ImageSeq{
        private Long imageId;
        private Integer seq;
    }

    @Getter
    public static class NewImageSeq{
        private String tempUrl;
        private Integer seq;
    }

    @Getter
    public static class ImageSeqInfo {
        private List<ImageSeq> existingImages;
        private List<NewImageSeq> newImages;
    }
}
