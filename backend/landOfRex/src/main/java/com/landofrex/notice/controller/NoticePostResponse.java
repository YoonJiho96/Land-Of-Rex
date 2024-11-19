package com.landofrex.notice.controller;

import com.landofrex.notice.NoticeImportance;
import com.landofrex.notice.NoticePost;
import com.landofrex.post.controller.PostImageDto;
import com.landofrex.post.entity.PostStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class NoticePostResponse {
    private final Long id;
    private final String title;
    private final String content;
    private final NoticeImportance importance;
    private final UserSimpleResponse author;
    private final List<PostImageDto> images;
    private final PostStatus status;
    private final LocalDateTime createdAt;
    private final LocalDateTime modifiedAt;

    @Builder
    public NoticePostResponse(NoticePost entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.importance = entity.getImportance();
        this.author = new UserSimpleResponse(entity.getAuthor());
        this.images = entity.getPostImages().stream()
                .map(PostImageDto::new)
                .collect(Collectors.toList());
        this.status = entity.getStatus();
        this.createdAt = entity.getCreatedAt();
        this.modifiedAt = entity.getUpdatedAt();
    }
}