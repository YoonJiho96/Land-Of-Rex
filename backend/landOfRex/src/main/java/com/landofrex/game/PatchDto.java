package com.landofrex.game;

import com.landofrex.game.entity.Patch;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class PatchDto {
    private String version;
    public PatchDto(Patch patch) {
        this.version=patch.getVersion();
    }
}
