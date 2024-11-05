package com.landofrex.game.ranking.service;

import com.landofrex.game.ranking.dto.RankingDto;
import com.landofrex.game.ranking.dto.RankingResponseDto;
import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.game.ranking.entity.StageInfo;
import com.landofrex.game.ranking.repository.RankingRepository;
import com.landofrex.game.ranking.repository.StageInfoRepository;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RankingService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final StageInfoRepository stageInfoRepository;
    private final RankingRepository rankingRepository;

    public RankingResponseDto submitScore(Long userId, StageInfoRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Create new stage info
        StageInfo stageInfo = StageInfo.of(user, request);

        // Save to Redis
        String redisKey = getRedisKey(request.getStage());
        ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
        zSetOps.add(redisKey, stageInfo, request.getScore());

        // Calculate ranking
        Long rank = zSetOps.rank(redisKey, stageInfo);

        if (rank == null) {
            return createRankingResponseDto(false, "Failed to calculate ranking",
                    Collections.singletonList(createRankingDTO(stageInfo, 0)));
        }

        log.info("Score submitted - User: {}, Stage: {}, Score: {}, Rank: {}",
                user.getNickname(), request.getStage(), request.getScore(), rank);

        return createRankingResponseDto(true, "Score submitted successfully",
                Collections.singletonList(createRankingDTO(stageInfo, rank.intValue() + 1)));
    }

    public RankingResponseDto getRankings(Integer stage) {
        String redisKey = getRedisKey(stage);
        ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();

        Set<ZSetOperations.TypedTuple<Object>> rankings =
                zSetOps.reverseRangeWithScores(redisKey, 0, 99);

        if (rankings == null || rankings.isEmpty()) {
            return createRankingResponseDto(true, "No rankings available", new ArrayList<>());
        }

        List<RankingDto> rankingDTOs = new ArrayList<>();
        int rank = 1;
        for (ZSetOperations.TypedTuple<Object> tuple : rankings) {
            StageInfo stageInfo = (StageInfo) tuple.getValue();
            rankingDTOs.add(createRankingDTO(stageInfo, rank++));
        }

        return createRankingResponseDto(true, "Rankings retrieved successfully", rankingDTOs);
    }

    // 스케쥴링
//    @Scheduled(cron = "0 0 0 * * *")
    @Scheduled(fixedRate = 5000)
    @Transactional
    public void migrateRankingsToMySQL() {
        Set<String> keys = redisTemplate.keys("ranking:stage:*");
        if (keys == null) return;
        System.out.println("e1");
        System.out.println("Found keys: " + keys); // 어떤 키들이 있는지 확인

        for (String key : keys) {
            System.out.println("e2");
            ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
            Set<ZSetOperations.TypedTuple<Object>> rankings = zSetOps.rangeWithScores(key, 0, -1);
            System.out.println("e2_1");
            if (rankings == null) continue;
            System.out.println("rankings size: " + rankings.size());
            System.out.println("e2_2");
            for (ZSetOperations.TypedTuple<Object> tuple : rankings) {
                try{
                    System.out.println("e3");
                    StageInfo stageInfo = (StageInfo) tuple.getValue();
                    StageInfo savedStageInfo = stageInfoRepository.save(stageInfo);

                    int rank = zSetOps.rank(key, tuple.getValue()).intValue() + 1;

                    Ranking ranking = new Ranking();
                    ranking.setUser(stageInfo.getUser());
                    ranking.setStageInfo(savedStageInfo);
                    ranking.setRanking(rank);

                    rankingRepository.save(ranking);}
                catch(Exception e) {
                    System.out.println("Error processing tuple: " + e.getMessage());
                    e.printStackTrace();
                }

            }
        }
    }

    private String getRedisKey(Integer stage) {
        return "ranking:stage:" + stage;
    }

    private RankingDto createRankingDTO(StageInfo stageInfo, int rank) {
        RankingDto dto = new RankingDto();
        dto.setNickname(stageInfo.getUser().getNickname());
        dto.setScore(stageInfo.getScore());
        dto.setCreatedAt(stageInfo.getCreatedAt());
        dto.setRanking(rank);
        return dto;
    }

    private RankingResponseDto createRankingResponseDto(boolean success, String message,
                                                        List<RankingDto> rankings) {
        RankingResponseDto response = new RankingResponseDto();
        response.setSuccess(success);
        response.setMessage(message);
        response.setData(rankings);
        return response;
    }
}
