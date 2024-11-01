package com.landofrex.game.ranking.repository;

import com.landofrex.game.ranking.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {
    // 상위 100명 랭킹데이터
    List<Ranking> findTop100ByOrderByScoreDesc();
}
