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
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final RankingRepository rankingRepository;
    private final StageInfoRepository stageInfoRepository;
    private final UserRepository userRepository;

    private static final String RANKING_KEY_PREFIX = "ranking:stage:";

    @Transactional
    public RankingResponseDto submitScore(Long userId, StageInfoRequestDto request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Redis에 점수 저장
            String rankingKey = RANKING_KEY_PREFIX + request.getStage();
            ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();

            // 기존 스테이지 정보 확인
            Optional<StageInfo> existingStageInfo = stageInfoRepository.findByUserAndStage(user, request.getStage());

            if (existingStageInfo.isPresent() && existingStageInfo.get().getScore() >= request.getScore()) {
                // 기존 점수가 더 높으면 새로운 점수를 저장하지 않음
                return createRankingResponse(false, Collections.emptyList(), "Existing score is higher");
            }

            // 새로운 스테이지 정보 저장
            StageInfo stageInfo = StageInfo.of(user, request);
            stageInfoRepository.save(stageInfo);

            // Redis에 점수 업데이트
            zSetOps.add(rankingKey, user.getNickname(), request.getScore());

            // 현재 랭킹 정보 조회
            Set<ZSetOperations.TypedTuple<Object>> rankings = zSetOps.reverseRangeWithScores(rankingKey, 0, -1);
            List<RankingDto> rankingDtos = convertToRankingDtoList(rankings);

            return createRankingResponse(true, rankingDtos, "Score submitted successfully");
        } catch (Exception e) {
            return createRankingResponse(false, Collections.emptyList(), "Error submitting score: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public RankingResponseDto getRankings(Integer stage) {
        try {
            String rankingKey = RANKING_KEY_PREFIX + stage;
            ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
            Set<ZSetOperations.TypedTuple<Object>> rankings = zSetOps.reverseRangeWithScores(rankingKey, 0, -1);

            if (rankings == null || rankings.isEmpty()) {
                // Redis에 데이터가 없으면 DB에서 조회
                List<Ranking> dbRankings = rankingRepository.findByStageInfoStageOrderByRanking(stage);
                List<RankingDto> rankingDtos = dbRankings.stream()
                        .map(this::convertToRankingDto)
                        .collect(Collectors.toList());
                return createRankingResponse(true, rankingDtos, "Rankings retrieved from database");
            }

            List<RankingDto> rankingDtos = convertToRankingDtoList(rankings);
            return createRankingResponse(true, rankingDtos, "Rankings retrieved successfully");
        } catch (Exception e) {
            return createRankingResponse(false, Collections.emptyList(), "Error retrieving rankings: " + e.getMessage());
        }
    }

//    @Scheduled(fixedRate = 12 * 60 * 60 * 1000) // 12시간마다 실행
    @Scheduled(fixedRate = 5000) // 5초마다 실행
    @Transactional
    public void syncRankingsToDatabase() {
        Set<String> keys = redisTemplate.keys(RANKING_KEY_PREFIX + "*");
        if (keys == null) return;

        for (String key : keys) {
            Integer stage = Integer.parseInt(key.replace(RANKING_KEY_PREFIX, ""));
            ZSetOperations<String, Object> zSetOps = redisTemplate.opsForZSet();
            Set<ZSetOperations.TypedTuple<Object>> rankings = zSetOps.reverseRangeWithScores(key, 0, -1);

            if (rankings == null) continue;

            int rank = 1;
            for (ZSetOperations.TypedTuple<Object> rankingTuple : rankings) {
                String nickname = (String) rankingTuple.getValue();
                Double score = rankingTuple.getScore();
                if (nickname == null || score == null) continue;

                User user = userRepository.findByNickname(nickname)
                        .orElseThrow(() -> new RuntimeException("User not found: " + nickname));

                Optional<Ranking> existingRanking = rankingRepository.findByUserAndStageInfoStage(user, stage);

                if (existingRanking.isPresent()) {
                    Ranking ranking = existingRanking.get();
                    ranking.setRanking(rank);
                    rankingRepository.save(ranking);
                } else {
                    Optional<StageInfo> stageInfo = stageInfoRepository.findByUserAndStage(user, stage);
                    if (stageInfo.isPresent()) {
                        Ranking newRanking = new Ranking();
                        newRanking.setUser(user);
                        newRanking.setStageInfo(stageInfo.get());
                        newRanking.setRanking(rank);
                        rankingRepository.save(newRanking);
                    }
                }
                rank++;
            }
        }
    }

    private RankingDto convertToRankingDto(Ranking ranking) {
        RankingDto dto = new RankingDto();
        dto.setNickname(ranking.getUser().getNickname());
        dto.setScore(ranking.getStageInfo().getScore());
        dto.setRanking(ranking.getRanking());
        dto.setCreatedAt(ranking.getStageInfo().getCreatedAt());
        return dto;
    }

    private List<RankingDto> convertToRankingDtoList(Set<ZSetOperations.TypedTuple<Object>> rankings) {
        List<RankingDto> rankingDtos = new ArrayList<>();
        int rank = 1;
        for (ZSetOperations.TypedTuple<Object> rankingTuple : rankings) {
            RankingDto dto = new RankingDto();
            dto.setNickname((String) rankingTuple.getValue());
            dto.setScore(rankingTuple.getScore().intValue());
            dto.setRanking(rank++);
            dto.setCreatedAt(null); // Redis에는 생성 시간 정보가 없으므로 null로 설정
            rankingDtos.add(dto);
        }
        return rankingDtos;
    }

    private RankingResponseDto createRankingResponse(boolean success, List<RankingDto> data, String message) {
        RankingResponseDto response = new RankingResponseDto();
        response.setSuccess(success);
        response.setData(data);
        response.setMessage(message);
        return response;
    }
}