package com.landofrex.game.ranking.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class RankingDto {
    private String nickname; // userId -> nickname
    private Integer score;
    private Integer ranking;
    private LocalDateTime createdAt;
}
