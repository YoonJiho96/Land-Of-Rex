package com.landofrex.game.entity;

import com.landofrex.audit.BaseTimeEntity;
import com.landofrex.game.PatchCreateRequest;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="patch")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Patch extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Getter
    @Column(nullable = false)
    String version;

    public Patch(PatchCreateRequest patchCreateRequest) {
        this.version= patchCreateRequest.version();
    }
}
