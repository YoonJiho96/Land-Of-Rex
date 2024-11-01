package com.landofrex.post.controller;


import com.landofrex.image.PostImage;
import lombok.Getter;

@Getter
public class PostImageDto {
    private String urlCloud;
    private String fileName;
    public PostImageDto(PostImage postImage) {
        this.urlCloud = postImage.getUrlCloud();
        this.fileName = postImage.getFileName();
    }
}
