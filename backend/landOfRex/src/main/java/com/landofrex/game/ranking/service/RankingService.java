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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RankingService {
    private final RankingRepository rankingRepository;
    private final StageInfoRepository stageInfoRepository;
    private final UserRepository userRepository;

    @Transactional
    public RankingResponseDto submitScore(Long userId, StageInfoRequestDto request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 해당 유저의 해당 스테이지 랭킹 정보 확인
            Optional<Ranking> existingRanking = rankingRepository.findByUserAndStageInfoStage(user, request.getStage());

            if (existingRanking.isPresent()) {
                // 기존 기록이 있는 경우
                StageInfo existingStageInfo = existingRanking.get().getStageInfo();
                if (existingStageInfo.getScore() >= request.getScore()) {
                    // 기존 점수가 더 높거나 같으면 기존 데이터 유지
                    return createRankingResponse(true, getRankingDtoList(request.getStage()),
                            "Existing score is higher or equal");
                }
                // 새로운 점수가 더 높으면 StageInfo 업데이트
                updateStageInfo(existingStageInfo, request);
            } else {
                // 새로운 기록 생성
                StageInfo newStageInfo = StageInfo.of(user, request);
                stageInfoRepository.save(newStageInfo);

                Ranking newRanking = new Ranking();
                newRanking.setUser(user);
                newRanking.setStageInfo(newStageInfo);
                rankingRepository.save(newRanking);
            }

            // 랭킹 순위 업데이트
            updateRankings(request.getStage());

            return createRankingResponse(true, getRankingDtoList(request.getStage()),
                    "Score submitted successfully");
        } catch (Exception e) {
            return createRankingResponse(false, null, "Error submitting score: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public RankingResponseDto getRankings(Integer stage) {
        try {
            List<RankingDto> rankings = getRankingDtoList(stage);
            return createRankingResponse(true, rankings, "Rankings retrieved successfully");
        } catch (Exception e) {
            return createRankingResponse(false, null, "Error retrieving rankings: " + e.getMessage());
        }
    }

    private List<RankingDto> getRankingDtoList(Integer stage) {
        List<Ranking> rankings = rankingRepository.findByStageInfoStageOrderByRanking(stage);
        List<RankingDto> rankingDtos = new ArrayList<>();

        for (Ranking ranking : rankings) {
            RankingDto dto = new RankingDto();
            dto.setNickname(ranking.getUser().getNickname());
            dto.setScore(ranking.getStageInfo().getScore());
            dto.setRanking(ranking.getRanking());
            dto.setCreatedAt(ranking.getStageInfo().getCreatedAt());
            rankingDtos.add(dto);
        }

        return rankingDtos;
    }

    private void updateRankings(Integer stage) {
        List<Ranking> rankings = rankingRepository.findByStageInfoStageOrderByRanking(stage);

        // Score 기준으로 정렬
        rankings.sort((r1, r2) ->
                Integer.compare(r2.getStageInfo().getScore(), r1.getStageInfo().getScore()));

        // 순위 업데이트
        for (int i = 0; i < rankings.size(); i++) {
            rankings.get(i).setRanking(i + 1);
        }

        rankingRepository.saveAll(rankings);
    }

    private void updateStageInfo(StageInfo stageInfo, StageInfoRequestDto request) {
        stageInfo.setEarnGold(request.getEarnGold());
        stageInfo.setSpendGold(request.getSpendGold());
        stageInfo.setClearTime(request.getClearTime());
        stageInfo.setDeathCount(request.getDeathCount());
        stageInfo.setScore(request.getScore());
    }

    private RankingResponseDto createRankingResponse(boolean success, List<RankingDto> data, String message) {
        RankingResponseDto response = new RankingResponseDto();
        response.setSuccess(success);
        response.setData(data);
        response.setMessage(message);
        return response;
    }
}