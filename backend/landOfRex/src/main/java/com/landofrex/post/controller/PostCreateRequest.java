package com.landofrex.post.controller;


import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 *
 * @param title
// * @param text
// * @param postType
 * @param imageFiles
 */
public record PostCreateRequest(@NotBlank String title,
//                                @NotBlank PostType postType,
                                String content,
                                List<MultipartFile> imageFiles) {
    @Builder
    public PostCreateRequest {
    }

}
