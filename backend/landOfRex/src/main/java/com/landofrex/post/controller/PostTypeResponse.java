package com.landofrex.post.controller;

import com.landofrex.post.entity.PostType;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PostTypeResponse {
    private String value;      // enum 이름
    private String label;      // 설명
    private boolean inquiryType;

    public static PostTypeResponse from(PostType postType) {
        return new PostTypeResponse(
                postType.name(),           // enum 이름 (ACCOUNT_ISSUE 등)
                postType.getDescription(), // 설명 ("계정 문제" 등)
                postType.isInquiryType()
        );
    }
}
