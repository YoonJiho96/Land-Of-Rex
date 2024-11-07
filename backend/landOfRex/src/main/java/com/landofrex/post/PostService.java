package com.landofrex.post;


import com.landofrex.post.controller.GeneralPostDto;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.controller.PostUpdateRequest;
import com.landofrex.post.entity.GeneralPost;
import com.landofrex.post.entity.PostStatus;
import com.landofrex.security.sanitizer.HtmlSanitizerService;
import com.landofrex.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final HtmlSanitizerService htmlSanitizerService;

//    public void initPost(User user){
//        GeneralPost post=new GeneralPost(user);
//        postRepository.save(post);
//    }

    public GeneralPost createPost(User user, PostCreateRequest postCreateRequest) throws IOException {
        htmlSanitizerService.sanitizeWithImages(postCreateRequest.getContent());
        GeneralPost generalPost = new GeneralPost(user,postCreateRequest);
        return postRepository.save(generalPost);
    }

    public GeneralPostDto.PageResponse getAllPosts(Pageable pageable){
        Page<GeneralPost> generalPosts=postRepository.findAll(pageable);
        return new GeneralPostDto.PageResponse(generalPosts);
    }
    public GeneralPost getPost(Long postId){
        return postRepository.findById(postId).orElseThrow(NoSuchElementException::new);
    }

    public GeneralPost updatePost(User user, PostUpdateRequest postUpdateRequest) {
        GeneralPost generalPost =postRepository.findById(postUpdateRequest.postId()).orElseThrow(NoSuchElementException::new);
        if(generalPost.getAuthor().equals(user)){
            generalPost.updateTitleAndText(postUpdateRequest);
            return postRepository.save(generalPost);
        }else{
            throw new NoSuchElementException();
        }
    }
    public Long updatePostStatus(Long postId, PostStatus postStatus) {
        GeneralPost generalPost =getPost(postId);
        generalPost.updateStatus(postStatus);
        return postRepository.save(generalPost).getId();
    }
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

}
