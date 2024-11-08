package com.landofrex.post.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostType {
    INQUIRY("문의사항", true),
    QUESTION("질문", true),
    FREE("자유게시글", false),
    SUGGESTION("건의사항", true);

    private final String description;
    private final boolean inquiryType;  // 문의/답변이 필요한 타입인지
}