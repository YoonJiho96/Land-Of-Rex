package com.landofrex.post.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.landofrex.gcs.GcsService;
import com.landofrex.image.ImageService;
import com.landofrex.post.PostService;
import com.landofrex.post.entity.Post;
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

        Post post=postService.createPost(user,postCreateRequest);
        if(imageFiles!=null){
            imageService.uploadImagesToPost(post,imageFiles);
        }
        return ResponseEntity.ok(post.getId());
    }

    @GetMapping
    public ResponseEntity<List<PostDto>> getPosts(@RequestParam("page") int page, @RequestParam("size") int size) {
        Pageable pageable=PageRequest.of(page, size);
        List<PostDto> postDtos=postService.getAllPosts(pageable).stream()
                .map(PostDto::new).toList();

        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(new PostDto(postService.getPost(postId)));
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
        Post post=postService.updatePost(user,postUpdateRequest);

        return ResponseEntity.ok(post.getId());
    }
}
