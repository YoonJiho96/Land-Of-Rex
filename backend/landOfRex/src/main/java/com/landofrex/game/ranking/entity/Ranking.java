package com.landofrex.game.ranking.entity;

import com.landofrex.audit.AuditDateTime;
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
    private Long rank_id;

    private String nickname;
    private float clearTime;
    private int earnGold;
    private int spendGold;
    private int deathCount;
    private int score;
}
