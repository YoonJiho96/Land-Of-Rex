package com.landofrex.post.entity;

import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Getter
@DiscriminatorValue("GENERAL")
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class GeneralPost extends BasePost {
    @Enumerated(EnumType.STRING)
    private PostType postType;

    @Enumerated(EnumType.STRING)
    private InquiryStatus inquiryStatus;  // 문의글일 때만 사용

    public GeneralPost(User user,PostCreateRequest postCreateRequest) {
        super(postCreateRequest,user);
        this.postType=postCreateRequest.getPostType();
        if(postCreateRequest.getPostType().isInquiryType()){
            inquiryStatus=InquiryStatus.UNCHECKED;
        }
    }

    public void updateInquiryStatus(InquiryStatus inquiryStatus) {
        this.inquiryStatus=inquiryStatus;
    }
}
