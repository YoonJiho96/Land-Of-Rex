package com.landofrex;

import static org.assertj.core.api.Assertions.assertThat;

import com.landofrex.game.ranking.dto.RankingResponseDto;
import com.landofrex.game.ranking.dto.StageInfoRequestDto;
import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.game.ranking.entity.StageInfo;
import com.landofrex.game.ranking.repository.RankingRepository;
import com.landofrex.game.ranking.repository.StageInfoRepository;
import com.landofrex.game.ranking.service.RankingService;
import com.landofrex.user.controller.UserSignUpDto;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("perform-test")
@Transactional
class RankingServiceTest {

    @Autowired
    private RankingService rankingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StageInfoRepository stageInfoRepository;

    @Autowired
    private RankingRepository rankingRepository;

    private User testUser;
    private StageInfoRequestDto testRequest;

    @BeforeEach
    void setUp() {
        // Clean up databases
        rankingRepository.deleteAll();
        stageInfoRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        UserSignUpDto signUpDto = new UserSignUpDto("test", "1234", "nick");
        testUser = userRepository.save(new User(signUpDto));

        // Create test request
        testRequest = new StageInfoRequestDto();
        testRequest.setStage(1);
        testRequest.setScore(1000);
        testRequest.setDeathCount(2);
        testRequest.setEarnGold(100);
        testRequest.setSpendGold(50);
        testRequest.setClearTime(100f);
    }

    @Test
    @DisplayName("새로운 점수 제출 - DB 저장 확인")
    void submitScore_CheckDatabaseSave() {
        // when
        RankingResponseDto response = rankingService.submitScore(testUser.getId(), testRequest);

        // then
        assertThat(response.isSuccess()).isTrue();

        StageInfo savedStageInfo = stageInfoRepository.findByUserAndStage(testUser, 1).get(0);
        assertThat(savedStageInfo.getScore()).isEqualTo(testRequest.getScore());

        Ranking savedRanking = rankingRepository.findByUserAndStageInfoStage(testUser, 1).get();
        assertThat(savedRanking.getStageInfo().getScore()).isEqualTo(testRequest.getScore());
    }

    @Test
    @DisplayName("점수 업데이트 - 높은 점수로 갱신")
    void submitScore_UpdateHigherScore() {
        // given
        rankingService.submitScore(testUser.getId(), testRequest);

        StageInfoRequestDto higherScoreRequest = new StageInfoRequestDto();
        higherScoreRequest.setStage(1);
        higherScoreRequest.setScore(2000);
        higherScoreRequest.setDeathCount(1);
        higherScoreRequest.setEarnGold(200);
        higherScoreRequest.setSpendGold(100);
        higherScoreRequest.setClearTime(90f);

        // when
        RankingResponseDto response = rankingService.submitScore(testUser.getId(), higherScoreRequest);

        // then
        assertThat(response.isSuccess()).isTrue();

        List<StageInfo> stageInfos = stageInfoRepository.findByUserAndStage(testUser, 1);
        assertThat(stageInfos).hasSize(2);

        Ranking updatedRanking = rankingRepository.findByUserAndStageInfoStage(testUser, 1).get();
        assertThat(updatedRanking.getStageInfo().getScore()).isEqualTo(2000);
    }

    @Test
    @DisplayName("점수 유지 - 낮은 점수 제출")
    void submitScore_KeepHigherScore() {
        // given
        rankingService.submitScore(testUser.getId(), testRequest);

        StageInfoRequestDto lowerScoreRequest = new StageInfoRequestDto();
        lowerScoreRequest.setStage(1);
        lowerScoreRequest.setScore(500);
        lowerScoreRequest.setDeathCount(3);
        lowerScoreRequest.setEarnGold(50);
        lowerScoreRequest.setSpendGold(25);
        lowerScoreRequest.setClearTime(120f);

        // when
        RankingResponseDto response = rankingService.submitScore(testUser.getId(), lowerScoreRequest);

        // then
        assertThat(response.isSuccess()).isTrue();

        Ranking ranking = rankingRepository.findByUserAndStageInfoStage(testUser, 1).get();
        assertThat(ranking.getStageInfo().getScore()).isEqualTo(1000);
    }

    @Test
    @DisplayName("존재하지 않는 사용자 점수 제출")
    void submitScore_NonExistentUser() {
        // when
        RankingResponseDto response = rankingService.submitScore(999L, testRequest);

        // then
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getMessage()).contains("User not found");
        assertThat(stageInfoRepository.findAll()).isEmpty();
        assertThat(rankingRepository.findAll()).isEmpty();
    }

    @AfterEach
    void cleanup() {
        rankingRepository.deleteAll();
        stageInfoRepository.deleteAll();
        userRepository.deleteAll();
    }
}