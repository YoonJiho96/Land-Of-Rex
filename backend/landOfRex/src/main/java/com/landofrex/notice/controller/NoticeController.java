package com.landofrex.notice.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.landofrex.image.ImageService;
import com.landofrex.notice.NoticePost;
import com.landofrex.notice.NoticePostCreateRequest;
import com.landofrex.notice.NoticePostDto;
import com.landofrex.notice.NoticePostService;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.entity.GeneralPost;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/notices")
public class NoticeController {
    private final NoticePostService noticePostService;
    private final ImageService imageService;

    @PostMapping(consumes = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Void> createNotice(@RequestPart(value="PostCreateRequest") String postCreateRequestString,
                                             @RequestPart(value="ImageFiles",required = false) List<MultipartFile> imageFiles) throws  IOException{
        User user=AuthenticationUtil.getUser();
        ObjectMapper objectMapper = new ObjectMapper();
        PostCreateRequest postCreateRequest = objectMapper.readValue(postCreateRequestString, PostCreateRequest.class);

        NoticePost noticePost=noticePostService.createNotice(user.getId(),postCreateRequest);
        if(imageFiles!=null){
            imageService.uploadImages(noticePost,imageFiles);
        }
        return ResponseEntity.noContent().build();
    }


    @GetMapping
    public ResponseEntity<NoticePostDto.PageResponse> getAllNotices(
            Integer page, Integer size) {
        Pageable pageable= PageRequest.of(page,size);
        NoticePostDto.PageResponse response = noticePostService.getAllNotices(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticePostDto.DetailResponse> getNoticeById(@PathVariable(name="noticeId") Long noticeId) {
        NoticePostDto.DetailResponse response = noticePostService.getNoticeById(noticeId);
        return ResponseEntity.ok(response);
    }
}
