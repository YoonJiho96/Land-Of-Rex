package com.landofrex.post.controller;



import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.landofrex.notice.NoticeImportance;
import com.landofrex.post.entity.PostType;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter
@NoArgsConstructor
public class PostCreateRequest {
    @NotBlank(message = "제목은 필수입니다")
    private String title;

//    @NotBlank(message = "내용은 필수입니다")
    private String content;

    private Boolean isPinned;

    private NoticeImportance importance;

    private PostType postType;

    @JsonCreator
    public PostCreateRequest(
            @JsonProperty("title") String title,
            @JsonProperty("content") String content,
            @JsonProperty("isPinned") Boolean isPinned,
            @JsonProperty("importance") NoticeImportance importance,
            @JsonProperty("postType") PostType postType
    ) {
        this.title = title;
        this.content = content;
        this.isPinned = isPinned;
        this.importance = importance;
        this.postType = postType;
    }

}
