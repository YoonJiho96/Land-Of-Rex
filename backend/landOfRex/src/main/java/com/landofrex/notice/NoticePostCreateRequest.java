package com.landofrex.notice;

import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class NoticePostCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private NoticeImportance importance;

    private List<MultipartFile> images = new ArrayList<>();

    @Builder
    public NoticePostCreateRequest(String title, String content, NoticeImportance importance, List<MultipartFile> images) {
        this.title = title;
        this.content = content;
        this.importance = importance;
        this.images = images != null ? images : new ArrayList<>();
    }

    public NoticePost toEntity(PostCreateRequest postCreateRequest,User author) {
        return NoticePost.builder()
                .postCreateRequest(postCreateRequest)
                .author(author)
                .build();
    }
}