package com.landofrex.post.controller;

import com.landofrex.post.entity.GeneralPost;
import com.landofrex.post.entity.InquiryStatus;
import com.landofrex.post.entity.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
@Getter
public class GeneralPostDto {

    @Getter
    public static class ListResponse {
        private final Long id;
        private final String title;
        private final String authorNickname;
        private final PostType postType;
        private final LocalDateTime createdAt;
        private final InquiryStatusResponse inquiryStatus;

        @Builder
        public ListResponse(GeneralPost generalPost) {
            this.id = generalPost.getId();
            this.title = generalPost.getTitle();
            this.authorNickname = generalPost.getAuthor().getNickname();
            this.createdAt = generalPost.getCreatedAt();
            this.postType= generalPost.getPostType();
            this.inquiryStatus = InquiryStatusResponse.from(generalPost.getInquiryStatus());
        }
    }

    @Getter
    public static class PageResponse {
        private final List<ListResponse> generalPosts;
        private final int totalPages;
        private final long totalElements;
        private final boolean hasNext;

        public PageResponse(Page<GeneralPost> generalPostPage) {
            this.generalPosts = generalPostPage.getContent().stream()
                    .map(GeneralPostDto.ListResponse::new)
                    .collect(Collectors.toList());
            this.totalPages = generalPostPage.getTotalPages();
            this.totalElements = generalPostPage.getTotalElements();
            this.hasNext = generalPostPage.hasNext();
        }
    }

    @Getter
    public static class DetailResponse {
        private final Long id;
        private final String title;
        private final String content;
        private final String authorNickname;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;
        private final List<PostImageDto> images;
        private final PostType postType;
        private final InquiryStatus inquiryStatus;
        @Builder
        public DetailResponse(GeneralPost generalPost) {
            this.id = generalPost.getId();
            this.title = generalPost.getTitle();
            this.content = generalPost.getContent();
            this.authorNickname = generalPost.getAuthor().getNickname();
            this.createdAt = generalPost.getCreatedAt();
            this.updatedAt = generalPost.getUpdatedAt();
            this.images = generalPost.getPostImages().stream()
                    .map(PostImageDto::new)
                    .collect(Collectors.toList());
            this.postType= generalPost.getPostType();
            this.inquiryStatus=generalPost.getInquiryStatus();
        }
    }


    public record InquiryStatusResponse(String status, String message) {
        public static InquiryStatusResponse from(InquiryStatus inquiryStatus) {
            return inquiryStatus != null
                    ? new InquiryStatusResponse(inquiryStatus.getStatus(), inquiryStatus.getMessage())
                    : null;
        }
    }
}
