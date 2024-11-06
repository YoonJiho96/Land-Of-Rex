package com.landofrex.post.entity;

import com.landofrex.audit.BaseTimeEntity;
import com.landofrex.image.PostImage;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Inheritance(strategy = InheritanceType.JOINED)  // 또는 SINGLE_TABLE
@DiscriminatorColumn
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public abstract class AbstractPost extends BaseTimeEntity {
    @Id
    @Column(name="post_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @NonNull
    private User author;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> postImages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    // 공통 메서드들
    protected AbstractPost(@NonNull User author) {
        this.author = author;
    }

    public void addImage(PostImage postImage) {
        this.postImages.add(postImage);
    }

    public void updateTitleAndText(String title, String content) {
        this.title = title;
        this.content = content;
    }
}
