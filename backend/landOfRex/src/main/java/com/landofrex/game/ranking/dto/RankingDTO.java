package com.landofrex.game.ranking.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RankingDTO {
    private String nickname;
    private int score;
    private String created_at;
}
