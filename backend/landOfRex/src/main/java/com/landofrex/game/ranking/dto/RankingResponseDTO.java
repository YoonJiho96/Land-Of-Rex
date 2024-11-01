package com.landofrex.game.ranking.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RankingResponseDTO {
    private boolean success;
    private List<RankingDTO> data;
    private String message;
}
