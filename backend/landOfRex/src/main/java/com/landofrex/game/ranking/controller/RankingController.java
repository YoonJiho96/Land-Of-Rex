package com.landofrex.game.ranking.controller;

import com.landofrex.game.ranking.dto.RankingResponseDto;
import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.game.ranking.service.RankingService;
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
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(rankingService.submitScore(userId, request));
    }

    @GetMapping("/{stage}")
    public ResponseEntity<RankingResponseDto> getRankings(@PathVariable Integer stage) {
        return ResponseEntity.ok(rankingService.getRankings(stage));
    }
}