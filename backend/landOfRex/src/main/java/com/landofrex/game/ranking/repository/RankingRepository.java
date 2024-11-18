package com.landofrex.game.ranking.repository;

import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {
    List<Ranking> findByStageInfoStageOrderByRanking(Integer stage);
    List<Ranking> findByStageInfoStageOrderByRanking(Integer stage, Pageable pageable);

    Optional<Ranking> findByUserAndStageInfoStage(User user, Integer stage);

    @EntityGraph(attributePaths = {"stageInfo"})
    List<Ranking> findByUserIdOrderByStageInfo_Stage(Long userId);

    @Query(value = """
    SELECT r.ranking_id, ROW_NUMBER() OVER (ORDER BY s.score DESC) AS ranking
    FROM ranking r
    JOIN stage_info s ON r.stage_info_id = s.stage_info_id
    WHERE s.stage = :stage
    """, nativeQuery = true)
    List<Object[]> getRankedRankings();

    @Modifying
    @Query(value = """
    UPDATE ranking 
    SET ranking = :newRanking 
    WHERE ranking_id = :rankingId
    """, nativeQuery = true)
    void updateRanking(@Param("rankingId") Long rankingId, @Param("newRanking") int newRanking);
}
