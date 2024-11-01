package com.landofrex.admin;


import com.landofrex.post.PostService;
import com.landofrex.post.entity.PostStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final PostService postService;
    @PutMapping("/posts/{postId}")
    public ResponseEntity<Long> updatePostStatus(@PathVariable Long postId, @RequestParam("Status") PostStatus postStatus) {
        //admin 확인 필터에서
        return ResponseEntity.ok(postService.updatePostStatus(postId,postStatus));
    }
}
