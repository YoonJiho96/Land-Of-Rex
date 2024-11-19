package com.landofrex.game.ranking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonalRankingResponseDto {
    private boolean success;
    private RankingDto data;
    private String message;
}
