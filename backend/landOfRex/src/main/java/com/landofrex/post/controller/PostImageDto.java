package com.landofrex.post.controller;


import com.landofrex.image.entity.PostImage;
import lombok.Getter;

@Getter
public class PostImageDto {
    private final String urlCloud;
    private final String fileName;
    private final Long imageId;
    public PostImageDto(PostImage postImage) {
        this.urlCloud = postImage.getUrlCloud();
        this.fileName = postImage.getFileName();
        this.imageId = postImage.getId();
    }
}
