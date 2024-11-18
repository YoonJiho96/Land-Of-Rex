package com.landofrex;

import com.landofrex.game.ranking.dto.RankingResponseDto;
import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.game.ranking.entity.StageInfo;
import com.landofrex.game.ranking.repository.RankingRepository;
import com.landofrex.game.ranking.repository.StageInfoRepository;
import com.landofrex.game.ranking.service.RankingService;
import com.landofrex.user.AuthService;
import com.landofrex.user.controller.UserSignUpDto;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DataJpaTest
@ActiveProfiles("test")
@Import(RankingService.class)
class RankingServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StageInfoRepository stageInfoRepository;

    @Mock
    private RankingRepository rankingRepository;


    @InjectMocks
    private RankingService rankingService;

    private User testUser;
    private StageInfoRequestDto testRequest;
    private StageInfo testStageInfo;
    private Ranking testRanking;

    @BeforeEach
    void setUp() {
        UserSignUpDto signUpDto=new UserSignUpDto("test","1234","nick");
        testUser=userRepository.save(new User(signUpDto));

        testRequest = new StageInfoRequestDto();
        testRequest.setStage(1);
        testRequest.setScore(1000);
        testRequest.setDeathCount(2);
        testRequest.setEarnGold(100);
        testRequest.setSpendGold(50);
        testRequest.setClearTime(100f);

        testStageInfo = StageInfo.of(testUser, testRequest);

        testRanking = new Ranking();
        testRanking.setUser(testUser);
        testRanking.setStageInfo(testStageInfo);
    }

    @Test
    @DisplayName("새로운 점수 제출 - 최초 제출")
    void submitScore_FirstSubmission() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stageInfoRepository.findByUserAndStage(testUser, 1))
                .thenReturn(Collections.singletonList(testStageInfo));
        when(rankingRepository.findByUserAndStageInfoStage(testUser, 1))
                .thenReturn(Optional.empty());
        when(stageInfoRepository.save(any(StageInfo.class))).thenReturn(testStageInfo);
        when(rankingRepository.save(any(Ranking.class))).thenReturn(testRanking);

        // when
        RankingResponseDto response = rankingService.submitScore(1L, testRequest);

        // then
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getMessage()).contains("successfully");

        verify(stageInfoRepository).save(any(StageInfo.class));
        verify(rankingRepository).save(any(Ranking.class));
    }

    @Test
    @DisplayName("기존 기록 업데이트 - 더 높은 점수")
    void submitScore_UpdateHigherScore() {
        // given
        StageInfo higherScoreStageInfo = StageInfo.of(testUser, testRequest);
        higherScoreStageInfo.setScore(2000);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stageInfoRepository.findByUserAndStage(testUser, 1))
                .thenReturn(Arrays.asList(testStageInfo, higherScoreStageInfo));
        when(rankingRepository.findByUserAndStageInfoStage(testUser, 1))
                .thenReturn(Optional.of(testRanking));
        when(stageInfoRepository.save(any(StageInfo.class))).thenReturn(higherScoreStageInfo);

        // when
        RankingResponseDto response = rankingService.submitScore(1L, testRequest);

        // then
        assertThat(response.isSuccess()).isTrue();
        verify(rankingRepository).save(any(Ranking.class));
    }

    @Test
    @DisplayName("기존 기록 유지 - 더 낮은 점수")
    void submitScore_KeepHigherScore() {
        // given
        StageInfo lowerScoreStageInfo = StageInfo.of(testUser, testRequest);
        lowerScoreStageInfo.setScore(500);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(stageInfoRepository.findByUserAndStage(testUser, 1))
                .thenReturn(Arrays.asList(testStageInfo, lowerScoreStageInfo));
        when(rankingRepository.findByUserAndStageInfoStage(testUser, 1))
                .thenReturn(Optional.of(testRanking));
        when(stageInfoRepository.save(any(StageInfo.class))).thenReturn(lowerScoreStageInfo);

        // when
        RankingResponseDto response = rankingService.submitScore(1L, testRequest);

        // then
        assertThat(response.isSuccess()).isTrue();
        verify(rankingRepository, never()).save(any(Ranking.class));
    }

    @Test
    @DisplayName("사용자를 찾을 수 없는 경우")
    void submitScore_UserNotFound() {
        // given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // when
        RankingResponseDto response = rankingService.submitScore(1L, testRequest);

        // then
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getMessage()).contains("Error");
        assertThat(response.getMessage()).contains("User not found");
    }

    @Test
    @DisplayName("예외 발생 시 처리")
    void submitScore_HandleException() {
        // given
        when(userRepository.findById(1L)).thenThrow(new RuntimeException("Database error"));

        // when
        RankingResponseDto response = rankingService.submitScore(1L, testRequest);

        // then
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getMessage()).contains("Error");
        assertThat(response.getMessage()).contains("Database error");
    }
}