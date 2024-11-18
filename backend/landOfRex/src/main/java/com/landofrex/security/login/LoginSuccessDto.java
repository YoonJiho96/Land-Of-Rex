package com.landofrex.security.login;

import com.landofrex.game.ranking.dto.StageProgressDto;
import com.landofrex.user.entity.Role;
import com.landofrex.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginSuccessDto {
    private String nickname;
    private Long userId;
    private Integer highestStage;
    private Role role;
    public LoginSuccessDto(User user, StageProgressDto stageProgressDto) {
        this.nickname = user.getNickname();
        this.userId = user.getId();
        this.highestStage = stageProgressDto.getHighestStage();
        this.role=user.getRole();
    }
}
