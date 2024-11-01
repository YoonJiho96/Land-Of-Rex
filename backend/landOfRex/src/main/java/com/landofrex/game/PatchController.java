package com.landofrex.game;


import com.landofrex.game.entity.Patch;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/patches")
@RestController
@RequiredArgsConstructor
public class PatchController {

    private final PatchRepository patchRepository;

    @GetMapping("/latest")
    public ResponseEntity<String> latest() {
        PatchDto patchDto=new PatchDto(patchRepository.findTopByOrderByIdDesc());
        return ResponseEntity.ok(patchDto.getVersion());
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody PatchCreateRequest patchCreateRequest) {
        patchRepository.save(new Patch(patchCreateRequest));
        return ResponseEntity.ok().build();
    }
}
