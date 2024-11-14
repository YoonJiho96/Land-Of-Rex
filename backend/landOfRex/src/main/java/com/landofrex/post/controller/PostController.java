package com.landofrex.post.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.landofrex.gcs.GcsService;
import com.landofrex.image.ImageService;
import com.landofrex.post.BasePostRepository;
import com.landofrex.post.GeneralPostService;
import com.landofrex.post.entity.GeneralPost;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/posts")
public class PostController {

    private final GeneralPostService generalPostService;
    private final ImageService imageService;


    @PostMapping(consumes = {MediaType.APPLICATION_OCTET_STREAM_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Long> createPost(
            @RequestPart(value="PostCreateRequest") String postCreateRequestString,
            @RequestPart(value="ImageFiles",required = false) List<MultipartFile> imageFiles
            ) throws IOException {

        User user= AuthenticationUtil.getUser();

        ObjectMapper objectMapper = new ObjectMapper();
        PostCreateRequest postCreateRequest = objectMapper.readValue(postCreateRequestString, PostCreateRequest.class);

        GeneralPost generalPost = generalPostService.createPost(user,postCreateRequest);

        if(imageFiles!=null && !imageFiles.isEmpty()){
            imageService.uploadImages(generalPost, imageFiles);
        }

        return ResponseEntity.ok(generalPost.getId());
    }

    @GetMapping
    public ResponseEntity<GeneralPostDto.PageResponse> getPosts(@RequestParam("page") int page, @RequestParam("size") int size) {
        Pageable pageable=PageRequest.of(page, size, Sort.by("createdAt").descending());
        GeneralPostDto.PageResponse posts= generalPostService.getAllPosts(pageable);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<GeneralPostDto.DetailResponse> getPost(@PathVariable Long postId) {
        GeneralPostDto.DetailResponse response=new GeneralPostDto.DetailResponse(generalPostService.getPost(postId));
        return ResponseEntity.ok(response);
    }

    @PatchMapping(
            value = "/{postId}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Long> updatePost(@PathVariable Long postId,
                                           @RequestParam(value="PostUpdateRequest") String postUpdateRequestString,
                                           @RequestParam(value="ImageFiles",required = false) List<MultipartFile> imageFiles
                                           ) throws IOException, IllegalAccessException {
        User user= AuthenticationUtil.getUser();
        ObjectMapper objectMapper = new ObjectMapper();
        PostUpdateRequest postUpdateRequest = objectMapper.readValue(postUpdateRequestString, PostUpdateRequest.class);

        if (postUpdateRequest.imageSeqInfo().getExistingImages() != null) {
            imageService.updateImageSeqs(postId,postUpdateRequest.imageSeqInfo().getExistingImages());
        }

        if (imageFiles != null && postUpdateRequest.imageSeqInfo().getNewImages() != null) {
            List<Integer> orders = postUpdateRequest.imageSeqInfo().getNewImages()
                    .stream().map(PostUpdateRequest.NewImageSeq::getSeq).toList();
            imageService.uploadImages(postId, imageFiles, orders);
        }

        GeneralPost generalPost = generalPostService.updatePost(user,postId,postUpdateRequest);

        return ResponseEntity.ok(generalPost.getId());
    }

    @DeleteMapping("/{postId}")
    public void deletePost(@PathVariable Long postId) throws IllegalAccessException {
        User user= AuthenticationUtil.getUser();
        generalPostService.deletePost(postId,user);
    }
}
