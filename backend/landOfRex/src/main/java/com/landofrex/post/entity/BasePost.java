package com.landofrex.post.entity;

import com.landofrex.audit.BaseTimeEntity;
import com.landofrex.image.entity.PostImage;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.controller.PostUpdateRequest;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name="Post")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public abstract class BasePost extends BaseTimeEntity {
    @Id
    @Column(name = "post_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> postImages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PostStatus status=PostStatus.ACTIVE;

    protected BasePost() {}

    protected BasePost(PostCreateRequest postCreateRequest, User author) {
        this.title = postCreateRequest.getTitle();
        this.content = postCreateRequest.getContent();
        this.author = author;
    }

    public void updateTitleAndText(PostUpdateRequest postUpdateRequest) {
        this.title=postUpdateRequest.title();
        this.content=postUpdateRequest.content();
    }

    public void updateStatus(PostStatus status) {
        this.status=status;
    }

    public void addImage(PostImage postImage) {
        this.postImages.add(postImage);
    }

}
