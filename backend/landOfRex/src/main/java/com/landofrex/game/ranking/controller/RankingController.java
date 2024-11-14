package com.landofrex.game.ranking.controller;

import com.landofrex.game.ranking.dto.PersonalRankingResponseDto;
import com.landofrex.game.ranking.dto.RankingResponseDto;
import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.game.ranking.service.RankingService;
import com.landofrex.security.AuthenticationUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rankings")
@RequiredArgsConstructor
public class RankingController {
    private final RankingService rankingService;

    @PostMapping
    public ResponseEntity<RankingResponseDto> submitScore(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StageInfoRequestDto request) {

        Long userId = AuthenticationUtil.getUser().getId();
        return ResponseEntity.ok(rankingService.submitScore(userId, request));
    }

    @GetMapping("/{stage}")
    public ResponseEntity<RankingResponseDto> getRankings(@PathVariable(name = "stage") Integer stage) {
        return ResponseEntity.ok(rankingService.getRankings(stage));
    }

    @GetMapping("/{stage}/personal")
    public ResponseEntity<PersonalRankingResponseDto> getPersonalRanking(
            @PathVariable(name = "stage") Integer stage,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = AuthenticationUtil.getUser().getId();
        return ResponseEntity.ok(rankingService.getPersonalRanking(userId, stage));
    }
}