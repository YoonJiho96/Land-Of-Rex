package com.landofrex.image;


import com.landofrex.audit.AuditDateTime;
import com.landofrex.post.entity.Post;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Getter
@Entity
@Table(name="post_images")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostImage extends AuditDateTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="post_image_id")
    private Long id;

    private String fileName;

    @ManyToOne
    @NonNull
    @JoinColumn(name="post_id")
    Post post;

    private String urlCloud;

    @Enumerated(EnumType.STRING)
    private ImageStatus status;

    public PostImage(@NonNull Post post, String urlCloud, String fileName) {
        this.urlCloud = urlCloud;
        this.post = post;
        this.fileName=fileName;
        this.status=ImageStatus.UPLOAD_SUCCESS;
    }

}
