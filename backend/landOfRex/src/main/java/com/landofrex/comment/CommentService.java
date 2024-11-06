package com.landofrex.comment;

import com.landofrex.post.PostRepository;
import com.landofrex.post.entity.Post;
import com.landofrex.post.entity.PostStatus;
import com.landofrex.user.entity.Role;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    // 댓글 생성
    @Transactional
    public CommentDto.Response createComment(Long userId, Long postId, CommentDto.Request request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if(user.getRole().equals(Role.ADMIN)) post.updateStatus(PostStatus.CHECKED);

        Comment comment = request.toEntity(user, post);

        Comment savedComment = commentRepository.save(comment);
        return new CommentDto.Response(savedComment);
    }

    // 게시글의 모든 댓글 조회
    public List<CommentDto.Response> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(CommentDto.Response::new)
                .collect(Collectors.toList());
    }

    // 사용자가 작성한 모든 댓글 조회
    public List<CommentDto.Response> getCommentsByUser(Long userId) {
        return commentRepository.findByAuthorIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(CommentDto.Response::new)
                .collect(Collectors.toList());
    }

    // 댓글 수정
    @Transactional
    public CommentDto.Response updateComment(Long userId, Long commentId, CommentDto.Request request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글 수정 권한이 없습니다.");
        }

        comment.update(request.getContent());
        return new CommentDto.Response(comment);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getAuthor().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }

}