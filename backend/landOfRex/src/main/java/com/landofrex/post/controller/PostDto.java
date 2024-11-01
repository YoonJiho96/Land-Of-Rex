package com.landofrex.post.controller;


import com.landofrex.post.entity.Post;
import com.landofrex.post.entity.PostStatus;
import com.landofrex.post.entity.PostType;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@Getter
public class PostDto {

    private Long id;

    private PostType type;

    private String title;

    private String text;

    private List<PostImageDto> postImages;

    private String authorNickname;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private PostStatus status;


    public PostDto(Post post) {
        this.id = post.getId();
        this.type = post.getType();
        this.authorNickname=post.getAuthor().getNickname();
        this.title = post.getTitle();
        this.text = post.getText();
        this.status = post.getStatus();

        this.postImages =post.getPostImages().stream().map(PostImageDto::new).toList();
        this.createdAt=post.getCreatedAt();
        this.updatedAt=post.getUpdatedAt();
    }
}
