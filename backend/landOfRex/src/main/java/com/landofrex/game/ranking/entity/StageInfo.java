package com.landofrex.game.ranking.entity;

import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "stage_info")
@Getter
@Setter
public class StageInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stage_info_id")
    private Long stageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "stage")
    private int stage;

    @Column(name = "earn_glod")
    private int earnGold;

    @Column(name = "spend_gold")
    private int spendGold;

    @Column(name = "death_count")
    private int deathCount;

    @Column(name = "score")
    private int score;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "clear_time")
    private Float clearTime;

    public StageInfo() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // 생성자
    public StageInfo(User user, StageInfoRequestDto request) {
        this.user = user;
        this.stage = request.getStage();
        this.earnGold = request.getEarnGold();
        this.spendGold = request.getSpendGold();
        this.clearTime = request.getClearTime();
        this.deathCount = request.getDeathCount();
        this.score = request.getScore();
    }

    // 정적 팩토리 메서드
    public static StageInfo of(User user, StageInfoRequestDto request) {
        return new StageInfo(user, request);
    }
}
