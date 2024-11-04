package com.landofrex.game.ranking.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RankingResponseDto {
    private boolean success;
    private List<RankingDto> data;
    private String message;
}
