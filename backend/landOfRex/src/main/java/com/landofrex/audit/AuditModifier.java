package com.landofrex.audit;

import com.landofrex.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditModifier {
    @CreatedBy
    @ManyToOne
    @Column(updatable = false)
    private User Creater;

    @LastModifiedBy
    @ManyToOne
    private User lastModifier;
}
