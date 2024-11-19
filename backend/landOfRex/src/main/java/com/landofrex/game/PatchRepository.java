package com.landofrex.game;

import com.landofrex.game.entity.Patch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatchRepository extends JpaRepository<Patch, Long> {
    Patch findTopByOrderByIdDesc();
}
