package com.landofrex.image.entity;


import com.landofrex.audit.BaseTimeEntity;
import com.landofrex.image.ImageStatus;
import com.landofrex.post.entity.GeneralPost;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Getter
@Entity
@Table(name="post_images")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostImage extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="post_image_id")
    private Long id;

    private String fileName;

    @ManyToOne
    @NonNull
    @JoinColumn(name="post_id")
    GeneralPost generalPost;

    private String urlCloud;

    @Enumerated(EnumType.STRING)
    private ImageStatus status;

    public PostImage(@NonNull GeneralPost generalPost, String urlCloud, String fileName) {
        this.urlCloud = urlCloud;
        this.generalPost = generalPost;
        this.fileName=fileName;
        this.status=ImageStatus.UPLOAD_SUCCESS;
    }

}
