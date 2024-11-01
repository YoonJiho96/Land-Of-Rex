package com.landofrex.game;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/games")
public class GameController {
    @PostMapping("/stages/{stageId}/clear")
    public void createStageClear(@PathVariable("stageId") int stageId) {
        return;
    }
}
