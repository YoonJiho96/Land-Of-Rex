package com.landofrex.post.entity;

import com.landofrex.image.PostImage;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.controller.PostUpdateRequest;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;

@Getter
@Table(name="post")
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends AbstractPost {
    @Id
    @Column(name="post_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    private PostType type;

    @Column(nullable = false , length = 30)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> postImages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name="user_id")
    @NonNull
    private User author;

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    public Post(@NonNull User user, PostCreateRequest postCreateRequest) {
        this.title= postCreateRequest.title();
//        this.type = postCreateRequest.postType();
        this.author = user;
        this.content = postCreateRequest.content();
        this.status=PostStatus.UNCHEKCED;
    }

    public Post(@NonNull User user) {
        this.author = user;
        this.status=PostStatus.DRAFT;
    }


    public void addImage(PostImage postImage) {
        this.postImages.add(postImage);
    }

    public void updateTitleAndText(PostUpdateRequest postUpdateRequest) {
        this.title=postUpdateRequest.title();
        this.content=postUpdateRequest.content();
    }
    public void updateStatus(PostStatus status) {
        this.status=status;
    }
}
