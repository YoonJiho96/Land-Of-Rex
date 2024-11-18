package com.landofrex.post.controller;

import com.landofrex.post.entity.InquiryStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InquiryStatusResponse {
    private String name;
    private String status;
    private String message;

    public static InquiryStatusResponse from(InquiryStatus inquiryStatus) {
        return new InquiryStatusResponse(
                inquiryStatus.name(),
                inquiryStatus.getStatus(),
                inquiryStatus.getMessage()
        );
    }
}
