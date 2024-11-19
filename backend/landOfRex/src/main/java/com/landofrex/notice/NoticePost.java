package com.landofrex.notice;


import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.entity.BasePost;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;


@Getter
@Entity
@DiscriminatorValue("NOTICE")
public class NoticePost extends BasePost {

    private Boolean isPinned=false;

    @Enumerated(EnumType.STRING)
    private NoticeImportance importance = NoticeImportance.NORMAL;

    protected NoticePost() {}

    @Builder
    protected NoticePost(PostCreateRequest postCreateRequest, User author) {
        super(postCreateRequest,author);
        this.importance = postCreateRequest.getImportance() != null ? postCreateRequest.getImportance() : NoticeImportance.NORMAL;
        this.isPinned=postCreateRequest.getIsPinned() != null ? postCreateRequest.getIsPinned() : false;
    }
}