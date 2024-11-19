package com.landofrex.post.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostStatus {
    ACTIVE("활성"),
    HIDDEN("숨김"),
    DELETED("삭제됨");

    private final String description;
}
