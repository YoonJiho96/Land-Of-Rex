package com.landofrex.patchpost;

import com.landofrex.game.entity.Patch;
import com.landofrex.notice.NoticeImportance;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.entity.BasePost;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

@Getter
@Entity
@DiscriminatorValue("PATCH")
public class PatchPost extends BasePost {

    @OneToOne
    private Patch patch;

    protected PatchPost() {}

    @Builder
    public PatchPost(PostCreateRequest postCreateRequest, User author,
                     Patch patch) {
        super(postCreateRequest,author);
        this.patch = patch;
    }
}