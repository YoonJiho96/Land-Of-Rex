package com.landofrex.aws.launcher;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/launcher")
@RequiredArgsConstructor
public class LauncherVersionController {
    private final LauncherVersionService launcherVersionService;

    @GetMapping("/version")
    public LauncherVersion getLatestVersion() {
        return launcherVersionService.getLatestVersion();
    }

    @GetMapping("/version/{platform}")
    public LauncherVersion.BuildInfo getLatestVersionForPlatform(@PathVariable String platform) {
        return launcherVersionService.getLatestVersionForPlatform(platform);
    }

    @GetMapping("/check-update")
    public boolean checkForUpdate(
            @RequestParam String currentVersion,
            @RequestParam String platform
    ) {
        return launcherVersionService.isNewVersionAvailable(currentVersion, platform);
    }
}