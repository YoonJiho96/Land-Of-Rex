package com.landofrex.game.ranking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GameResultDTO {
    private float clear_time;
    private int earn_gold;
    private int spend_gold;
    private int death_count;
    private int score;
}
