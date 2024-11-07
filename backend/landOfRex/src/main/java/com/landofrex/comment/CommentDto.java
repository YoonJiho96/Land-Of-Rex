package com.landofrex.comment;

import com.landofrex.post.entity.BasePost;
import com.landofrex.post.entity.GeneralPost;
import com.landofrex.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// CommentDto.java
public class CommentDto {

    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public static class Request {
        @NotBlank(message = "댓글 내용을 입력해주세요")
        private String content;

        public Comment toEntity(User author, BasePost post) {
            return Comment.builder()
                    .content(content)
                    .author(author)
                    .post(post)
                    .build();
        }
    }

    @Getter
    public static class Response {
        private final Long id;
        private final String content;
        private final String authorNickname;
        private final LocalDateTime createdAt;
        private final LocalDateTime modifiedAt;

        @Builder
        public Response(Comment comment) {
            this.id = comment.getId();
            this.content = comment.getContent();
            this.authorNickname = comment.getAuthor().getNickname();
            this.createdAt = comment.getCreatedAt();
            this.modifiedAt = comment.getUpdatedAt();
        }
    }
}