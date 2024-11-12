package com.landofrex.post.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PostType {
    ACCOUNT_ISSUE("계정 문제", true),
    GAME_FEEDBACK("게임 피드백", true),
    BUG_REPORT("버그 신고", true),
    SUGGESTION("건의 사항", true);

    private final String description;
    private final boolean inquiryType;  // 문의/답변이 필요한 타입인지
}