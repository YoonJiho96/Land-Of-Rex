package com.landofrex.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SuccessResponse<T> {
    private final String code = "success";
    private final T data;

    public static <T> SuccessResponse<T> of(T data) {
        return SuccessResponse.<T>builder()
                .data(data)
                .build();
    }

    public static SuccessResponse<Void> empty() {
        return SuccessResponse.<Void>builder().build();
    }
}