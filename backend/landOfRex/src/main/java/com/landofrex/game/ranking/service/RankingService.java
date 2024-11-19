package com.landofrex.game.ranking.service;

import com.landofrex.game.ranking.dto.*;
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
import java.util.Comparator;

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

            // 새로운 스테이지 정보 저장
            StageInfo newStageInfo = StageInfo.of(user, request);
            stageInfoRepository.save(newStageInfo);

            // 해당 유저의 해당 스테이지 최고 점수 StageInfo 찾기
            List<StageInfo> userStageInfos = stageInfoRepository.findByUserAndStage(user, request.getStage());
            StageInfo highestScoreStageInfo = userStageInfos.stream()
                    .max(Comparator.comparing(StageInfo::getScore))
                    .orElse(newStageInfo);

            // 랭킹 정보 처리
            Optional<Ranking> existingRanking = rankingRepository.findByUserAndStageInfoStage(user, request.getStage());

            if (existingRanking.isPresent()) {
                // 기존 랭킹이 있는 경우, 최고 점수로 업데이트
                Ranking ranking = existingRanking.get();
                if (highestScoreStageInfo.getScore() > ranking.getStageInfo().getScore()) {
                    ranking.setStageInfo(highestScoreStageInfo);
                    rankingRepository.save(ranking);
                }
            } else {
                // 새로운 랭킹 생성
                Ranking newRanking = new Ranking();
                newRanking.setUser(user);
                newRanking.setStageInfo(highestScoreStageInfo);
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

    @Transactional
    protected void updateRankings(Integer stage) {
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

    private RankingResponseDto createRankingResponse(boolean success, List<RankingDto> data, String message) {
        RankingResponseDto response = new RankingResponseDto();
        response.setSuccess(success);
        response.setData(data);
        response.setMessage(message);
        return response;
    }

    public StageProgressDto getStageProgress(Long userId) {
        List<Ranking> rankings = rankingRepository.findByUserIdOrderByStageInfo_Stage(userId);

        return StageProgressDto.fromStageInfo(rankings);
    }

    @Transactional(readOnly = true)
    public PersonalRankingResponseDto getPersonalRanking(Long userId, Integer stage) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Ranking> ranking = rankingRepository.findByUserAndStageInfoStage(user, stage);

            PersonalRankingResponseDto response = new PersonalRankingResponseDto();

            if (ranking.isPresent()) {
                RankingDto rankingDto = new RankingDto();
                rankingDto.setNickname(ranking.get().getUser().getNickname());
                rankingDto.setScore(ranking.get().getStageInfo().getScore());
                rankingDto.setRanking(ranking.get().getRanking());
                rankingDto.setCreatedAt(ranking.get().getStageInfo().getCreatedAt());

                response.setSuccess(true);
                response.setData(rankingDto);
                response.setMessage("Personal ranking retrieved successfully");
            } else {
                response.setSuccess(true);
                response.setData(null);
                response.setMessage("No ranking found for this stage");
            }

            return response;
        } catch (Exception e) {
            PersonalRankingResponseDto response = new PersonalRankingResponseDto();
            response.setSuccess(false);
            response.setData(null);
            response.setMessage("Error retrieving personal ranking: " + e.getMessage());
            return response;
        }
    }
}