package com.landofrex.game.ranking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StageInfoRequestDto {
    @NotNull
    private Long userId;
    @NotNull
    private String securityKey;
    @NotNull
    private Float clearTime;
    @NotNull
    private Integer earnGold;
    @NotNull
    private Integer spendGold;
    @NotNull
    private Integer deathCount;
    @NotNull
    private Integer score;
    @NotNull
    private Integer stage;

}
