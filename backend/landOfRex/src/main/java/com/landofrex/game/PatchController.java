package com.landofrex.game;


import com.landofrex.game.entity.Patch;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/patches")
@RestController
@RequiredArgsConstructor
public class PatchController {

    private final PatchRepository patchRepository;

    @GetMapping("/latest")
    public ResponseEntity<PatchDto> latest() {
        PatchDto patchDto=new PatchDto(patchRepository.findTopByOrderByIdDesc());
        return ResponseEntity.ok(patchDto);
    }
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody PatchCreateRequest patchCreateRequest) {
        patchRepository.save(new Patch(patchCreateRequest));
        return ResponseEntity.ok().build();
    }
}
