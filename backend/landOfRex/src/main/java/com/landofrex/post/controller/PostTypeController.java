package com.landofrex.post.controller;


import com.landofrex.post.entity.PostType;
import com.landofrex.response.SuccessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/post-types")
public class PostTypeController {
    @GetMapping
    public ResponseEntity<SuccessResponse<List<PostTypeResponse>>> getPostType() {
        List<PostTypeResponse> types = Arrays.stream(PostType.values())
                .map(PostTypeResponse::from)
                .toList();
        return ResponseEntity.ok(SuccessResponse.of(types));
    }
}
