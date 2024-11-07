package com.landofrex.post.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum InquiryStatus {
    UNCHECKED("미확인", "답변 대기중입니다."),
    CHECKED("확인", "확인 중입니다."),
    IN_PROGRESS("처리중", "답변을 작성중입니다."),
    RESOLVED("해결", "답변이 완료되었습니다."),
    REJECTED("반려", "답변이 불가능합니다.");

    private final String status;
    private final String message;
}