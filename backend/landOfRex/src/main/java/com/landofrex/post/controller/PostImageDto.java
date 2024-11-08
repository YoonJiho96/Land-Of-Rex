package com.landofrex.post.controller;


import com.landofrex.image.entity.PostImage;
import lombok.Getter;

@Getter
public class PostImageDto {
    private final String urlCloud;
    private final String fileName;
    public PostImageDto(PostImage postImage) {
        this.urlCloud = postImage.getUrlCloud();
        this.fileName = postImage.getFileName();
    }
}
