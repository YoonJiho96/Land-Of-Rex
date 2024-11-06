package com.landofrex.game.ranking.repository;

import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {
    List<Ranking> findByStageInfoStageOrderByRanking(Integer stage);
    Optional<Ranking> findByUserAndStageInfoStage(User user, Integer stage);
}
