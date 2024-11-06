package com.landofrex.notice;

import com.landofrex.audit.BaseEntity;
import jakarta.persistence.*;

@Entity
public class Notice extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="notice_id")
    private Long id;



}
