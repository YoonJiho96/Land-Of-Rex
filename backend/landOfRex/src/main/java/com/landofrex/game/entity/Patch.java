package com.landofrex.game.entity;

import com.landofrex.audit.AuditDateTime;
import com.landofrex.game.PatchCreateRequest;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.post.entity.Post;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="patch")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Patch extends AuditDateTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Getter
    @Column(nullable = false)
    String version;

    @OneToOne
    Post post;

    public Patch(PatchCreateRequest patchCreateRequest) {
        this.version= patchCreateRequest.version();
    }
}
