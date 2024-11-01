package com.landofrex.game.ranking.service;

import com.landofrex.game.ranking.dto.GameResultDTO;
import com.landofrex.game.ranking.dto.RankingDTO;
import com.landofrex.game.ranking.entity.Ranking;
import com.landofrex.game.ranking.repository.RankingRepository;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RankingService {

    private final RankingRepository rankingRepository;
//    private final UserService userService; // 사용자 정보를 가져오기 위한 서비스

    public RankingService(RankingRepository rankingRepository) {
        this.rankingRepository = rankingRepository;
    }

    public Ranking saveGameResult(GameResultDTO resultDTO, String token) {
        // 토큰으로부터 사용자 정보 가져오기
        User user = AuthenticationUtil.getUser();

        Ranking ranking = new Ranking();
        ranking.setNickname(user.getNickname());
        ranking.setClearTime(resultDTO.getClear_time());
        ranking.setEarnGold(resultDTO.getEarn_gold());
        ranking.setSpendGold(resultDTO.getSpend_gold());
        ranking.setDeathCount(resultDTO.getDeath_count());
        ranking.setScore(resultDTO.getScore());

        return rankingRepository.save(ranking);
    }

    public List<RankingDTO> getTopRankings() {
        return rankingRepository.findTop100ByOrderByScoreDesc()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private RankingDTO convertToDTO(Ranking ranking) {
        RankingDTO dto = new RankingDTO();
        dto.setNickname(ranking.getNickname());
        dto.setScore(ranking.getScore());
        dto.setCreated_at(
                ranking.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
        );
        return dto;
    }
}
