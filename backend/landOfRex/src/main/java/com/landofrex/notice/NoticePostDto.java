package com.landofrex.notice;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.landofrex.post.controller.PostCreateRequest;

import com.landofrex.post.controller.PostImageDto;
import com.landofrex.user.entity.User;
import lombok.*;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


public class NoticePostDto{


    @Getter
    public static class ListResponse {
        private final Long id;
        private final String title;
        private final String authorNickname;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private final LocalDateTime createdAt;
        private final NoticeImportance importance;

        @Builder
        public ListResponse(NoticePost notice) {
            this.id = notice.getId();
            this.title = notice.getTitle();
            this.authorNickname = notice.getAuthor().getNickname();
            this.createdAt = notice.getCreatedAt();
            this.importance = notice.getImportance();
        }
    }

    @Getter
    public static class PageResponse {
        private final List<ListResponse> notices;
        private final int totalPages;
        private final long totalElements;
        private final boolean hasNext;

        public PageResponse(Page<NoticePost> noticePage) {
            this.notices = noticePage.getContent().stream()
                    .map(ListResponse::new)
                    .collect(Collectors.toList());
            this.totalPages = noticePage.getTotalPages();
            this.totalElements = noticePage.getTotalElements();
            this.hasNext = noticePage.hasNext();
        }
    }

    @Getter
    public static class DetailResponse {
        private final Long id;
        private final String title;
        private final String content;
        private final String authorNickname;

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private final LocalDateTime createdAt;
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
        private final LocalDateTime updatedAt;
        private final NoticeImportance importance;
        private final List<PostImageDto> images;

        @Builder
        public DetailResponse(NoticePost notice) {
            this.id = notice.getId();
            this.title = notice.getTitle();
            this.content = notice.getContent();
            this.authorNickname = notice.getAuthor().getNickname();
            this.createdAt = notice.getCreatedAt();
            this.updatedAt = notice.getUpdatedAt();
            this.importance = notice.getImportance();
            this.images = notice.getPostImages().stream()
                    .map(PostImageDto::new)
                    .collect(Collectors.toList());
        }
    }
}
