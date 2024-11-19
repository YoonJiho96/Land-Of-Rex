package com.landofrex.notice.controller;

import com.landofrex.notice.NoticeImportance;
import com.landofrex.notice.NoticePost;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NoticePostListResponse {
    private final Long id;
    private final String title;
    private final NoticeImportance importance;
    private final UserSimpleResponse author;
    private final LocalDateTime createdAt;

    @Builder
    public NoticePostListResponse(NoticePost entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.importance = entity.getImportance();
        this.author = new UserSimpleResponse(entity.getAuthor());
        this.createdAt = entity.getCreatedAt();
    }
}