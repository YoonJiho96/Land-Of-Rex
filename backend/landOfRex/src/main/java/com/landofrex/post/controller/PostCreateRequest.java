package com.landofrex.post.controller;



import com.landofrex.notice.NoticeImportance;
import com.landofrex.post.entity.PostType;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
public class PostCreateRequest {
    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotBlank(message = "내용은 필수입니다")
    private String content;

    private Boolean isPinned;

    private NoticeImportance importance;

    private PostType postType;

}
