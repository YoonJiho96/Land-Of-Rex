package com.landofrex.notice;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NoticeImportance {
    URGENT("긴급"),
    HIGH("중요"),
    NORMAL("일반");

    private final String description;
}