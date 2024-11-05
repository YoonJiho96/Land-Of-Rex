package com.landofrex.comment;

import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentDto.Response>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto.Response> addComment(@PathVariable Long postId, @RequestBody CommentDto.Request commentRequest) {
        User user= AuthenticationUtil.getUser();
        return ResponseEntity.ok(commentService.createComment(user.getId(),postId, commentRequest));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentDto.Response> updateComment(@PathVariable Long postId, @PathVariable Long commentId,@RequestBody CommentDto.Request commentRequest) {
        User user= AuthenticationUtil.getUser();
        return ResponseEntity.ok(commentService.updateComment(user.getId(),commentId,commentRequest));
    }
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        User user= AuthenticationUtil.getUser();
        commentService.deleteComment(user.getId(),commentId);
        return ResponseEntity.noContent().build();
    }

}
