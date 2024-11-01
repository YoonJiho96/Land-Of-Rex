package com.landofrex.game.ranking.controller;

import com.landofrex.game.ranking.dto.GameResultDTO;
import com.landofrex.game.ranking.dto.RankingResponseDTO;
import com.landofrex.game.ranking.service.RankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class RankingController {

    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @PostMapping("/game-result")
    public ResponseEntity<Map<String, Object>> submitGameResult(
            @RequestBody GameResultDTO resultDTO,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            rankingService.saveGameResult(resultDTO, token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Game result saved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to save game result: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/rankings")
    public ResponseEntity<RankingResponseDTO> getRankings() {
        try {
            RankingResponseDTO response = new RankingResponseDTO();
            response.setSuccess(true);
            response.setData(rankingService.getTopRankings());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            RankingResponseDTO response = new RankingResponseDTO();
            response.setSuccess(false);
            response.setMessage("Failed to get rankings: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
