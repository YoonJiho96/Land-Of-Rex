package com.landofrex.post.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.landofrex.gcs.GcsService;
import com.landofrex.image.ImageService;
import com.landofrex.notice.NoticePostDto;
import com.landofrex.post.PostRepository;
import com.landofrex.post.PostService;
import com.landofrex.post.entity.GeneralPost;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;
    private final ImageService imageService;
    private final GcsService gcsService;
    private final PostRepository postRepository;

//    @PostMapping("/init")
//    public ResponseEntity<Long> initPost() {
//        postService.initPost(AuthenticationUtil.getUser(), )
//    }


    @PostMapping(consumes = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> createPost(
            @RequestPart(value="PostCreateRequest") String postCreateRequestString,
            @RequestPart(value="ImageFiles",required = false) List<MultipartFile> imageFiles) throws IOException {

        User user= AuthenticationUtil.getUser();

        ObjectMapper objectMapper = new ObjectMapper();
        PostCreateRequest postCreateRequest = objectMapper.readValue(postCreateRequestString, PostCreateRequest.class);

        GeneralPost generalPost =postService.createPost(user,postCreateRequest);
        if(imageFiles!=null){
            imageService.uploadImagesToPost(generalPost,imageFiles);
        }
        return ResponseEntity.ok(generalPost.getId());
    }

    @GetMapping
    public ResponseEntity<GeneralPostDto.PageResponse> getPosts(@RequestParam("page") int page, @RequestParam("size") int size) {
        Pageable pageable=PageRequest.of(page, size);
        GeneralPostDto.PageResponse posts=postService.getAllPosts(pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<GeneralPostDto.DetailResponse> getPost(@PathVariable Long postId) {
        GeneralPostDto.DetailResponse response=new GeneralPostDto.DetailResponse(postService.getPost(postId));
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<Long> updatePost(@PathVariable Long postId,
                                           @RequestParam("title") String title,
                                           @RequestParam("content") String content,
                                           @RequestParam("images") List<MultipartFile> imageFiles
                                           ){
        User user= AuthenticationUtil.getUser();
        PostUpdateRequest postUpdateRequest=PostUpdateRequest.builder()
                .postId(postId)
                .content(content)
                .title(title)
                .build();

        GeneralPost generalPost =postService.updatePost(user,postUpdateRequest);

        return ResponseEntity.ok(generalPost.getId());
    }
}
