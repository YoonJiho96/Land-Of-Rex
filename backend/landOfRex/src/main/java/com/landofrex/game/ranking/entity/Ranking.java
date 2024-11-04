package com.landofrex.game.ranking.entity;

import com.landofrex.audit.AuditDateTime;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Entity
@Table(name = "ranking")
@Getter
@Setter
public class Ranking extends AuditDateTime{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="ranking_id")
    private Long rankingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_info_id")
    private StageInfo stageInfo;

    private Integer ranking;
}