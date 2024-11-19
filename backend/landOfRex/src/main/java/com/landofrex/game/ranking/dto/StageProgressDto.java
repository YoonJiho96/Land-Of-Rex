package com.landofrex.game.ranking.dto;

import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.game.ranking.entity.StageInfo;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class StageProgressDto {
    private int highestStage;

    public StageProgressDto(int highestStage) {
        this.highestStage = highestStage;
    }

    public static StageProgressDto fromStageInfo(List<Ranking> rankings) {
        return rankings.stream()
                .map(ranking -> ranking.getStageInfo().getStage())
                .max(Integer::compareTo)
                .map(StageProgressDto::new)
                .orElseGet(() -> new StageProgressDto(-1));
    }

}