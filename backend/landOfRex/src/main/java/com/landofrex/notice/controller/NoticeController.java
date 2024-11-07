package com.landofrex.notice.controller;


import com.landofrex.notice.NoticePostCreateRequest;
import com.landofrex.notice.NoticePostDto;
import com.landofrex.notice.NoticePostService;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notices")
public class NoticeController {
    private final NoticePostService noticePostService;

    @PostMapping
    public ResponseEntity<Void> createNotice(@RequestBody PostCreateRequest noticeRequest) {
        User user=AuthenticationUtil.getUser();
        noticePostService.createNotice(user.getId(),noticeRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<NoticePostDto.PageResponse> getAllNotices(
            @PageableDefault(size = 10) Pageable pageable) {
        NoticePostDto.PageResponse response = noticePostService.getAllNotices(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticePostDto.DetailResponse> getNoticeById(@PathVariable(name="noticeId") Long noticeId) {
        NoticePostDto.DetailResponse response = noticePostService.getNoticeById(noticeId);
        return ResponseEntity.ok(response);
    }
}
