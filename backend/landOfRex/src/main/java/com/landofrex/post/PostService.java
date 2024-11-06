package com.landofrex.post;


import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.controller.PostUpdateRequest;
import com.landofrex.post.entity.Post;
import com.landofrex.post.entity.PostStatus;
import com.landofrex.security.sanitizer.HtmlSanitizerService;
import com.landofrex.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
//        Post post=new Post(user);
//        postRepository.save(post);
//    }

    public Post createPost(User user, PostCreateRequest postCreateRequest) throws IOException {
        htmlSanitizerService.sanitizeWithImages(postCreateRequest.content());
        Post post = new Post(user,postCreateRequest);
        return postRepository.save(post);
    }

    public List<Post> getAllPosts(Pageable pageable){
        return postRepository.findAll(pageable).getContent();
    }
    public Post getPost(Long postId){
        return postRepository.findById(postId).orElseThrow(NoSuchElementException::new);
    }

    public Post updatePost(User user, PostUpdateRequest postUpdateRequest) {
        Post post=postRepository.findById(postUpdateRequest.postId()).orElseThrow(NoSuchElementException::new);
        if(post.getAuthor().equals(user)){
            post.updateTitleAndText(postUpdateRequest);
            return postRepository.save(post);
        }else{
            throw new NoSuchElementException();
        }
    }
    public Long updatePostStatus(Long postId, PostStatus postStatus) {
        Post post=getPost(postId);
        post.updateStatus(postStatus);
        return postRepository.save(post).getId();
    }
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

}
