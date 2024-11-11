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
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class GeneralPostService {

    private final GeneralPostRepository generalPostRepository;
    private final HtmlSanitizerService htmlSanitizerService;

//    public void initPost(User user){
//        GeneralPost post=new GeneralPost(user);
//        postRepository.save(post);
//    }

    public GeneralPost createPost(User user, PostCreateRequest postCreateRequest) throws IOException {
        htmlSanitizerService.sanitizeWithImages(postCreateRequest.getContent());
        GeneralPost generalPost = new GeneralPost(user,postCreateRequest);
        return generalPostRepository.save(generalPost);
    }

    public GeneralPostDto.PageResponse getAllPosts(Pageable pageable){
        Page<GeneralPost> generalPosts= generalPostRepository.findAll(pageable);
        return new GeneralPostDto.PageResponse(generalPosts);
    }
    public GeneralPost getPost(Long postId){
        return generalPostRepository.findById(postId).orElseThrow(NoSuchElementException::new);
    }

    public GeneralPost updatePost(User user,Long postId, PostUpdateRequest postUpdateRequest) {
        GeneralPost generalPost = generalPostRepository.findById(postId).orElseThrow(NoSuchElementException::new);
        if(generalPost.getAuthor().getId().equals(user.getId())){
            generalPost.updateTitleAndText(postUpdateRequest);
            generalPost.setPostType(postUpdateRequest.postType());
            return generalPostRepository.save(generalPost);
        }else{
            throw new NoSuchElementException();
        }
    }
    public Long updatePostStatus(Long postId, PostStatus postStatus) {
        GeneralPost generalPost =getPost(postId);
        generalPost.updateStatus(postStatus);
        return generalPostRepository.save(generalPost).getId();
    }
    public void deletePost(Long postId) {
        generalPostRepository.deleteById(postId);
    }

    public Page<GeneralPost> getMyPosts(Long authorId,Pageable pageable){
        Page<GeneralPost> myPosts=generalPostRepository.findByAuthor_Id(authorId,pageable);
        return myPosts;
    }

}
