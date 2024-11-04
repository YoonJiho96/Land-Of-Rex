package com.landofrex.game.ranking.repository;

import com.landofrex.game.ranking.entity.StageInfo;
import com.landofrex.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StageInfoRepository extends JpaRepository<StageInfo, Long> {
    List<StageInfo> findByStageOrderByScoreDesc(Integer stage);
    Optional<StageInfo> findByUserAndStage(User user, Integer stage);
}
