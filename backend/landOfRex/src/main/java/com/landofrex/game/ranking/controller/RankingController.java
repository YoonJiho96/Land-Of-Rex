package com.landofrex.game.ranking.controller;

import com.landofrex.game.ranking.dto.PersonalRankingResponseDto;
import com.landofrex.game.ranking.dto.RankingResponseDto;
import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.game.ranking.service.RankingService;
import com.landofrex.game.ranking.service.RankingService2;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rankings")
@RequiredArgsConstructor
public class RankingController {
    private final RankingService2 rankingService;
    private final String securityKey = "parkyhAndleehj";

    @PostMapping
    public ResponseEntity<RankingResponseDto> submitScore(
            @Valid @RequestBody StageInfoRequestDto request) {
        Pageable pageable= PageRequest.of(0,10);
        if(request.getSecurityKey().equals(securityKey)) {
            return ResponseEntity.ok(rankingService.submitScore(request.getUserId(), request,pageable));
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{stage}")
    public ResponseEntity<RankingResponseDto> getRankings(@PathVariable(name = "stage") Integer stage) {
        Pageable pageable= PageRequest.of(0,10);
        return ResponseEntity.ok(rankingService.getRankings(stage,pageable));
    }

    @GetMapping("/{stage}/personal")
    public ResponseEntity<PersonalRankingResponseDto> getPersonalRanking(
            @PathVariable(name = "stage") Integer stage,
            @RequestParam(name = "userId") Long userId) {
        return ResponseEntity.ok(rankingService.getPersonalRanking(userId, stage));
    }
}