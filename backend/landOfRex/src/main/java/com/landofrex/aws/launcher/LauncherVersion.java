package com.landofrex.aws.launcher;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class LauncherVersion {
    private String version;
    private String releaseDate;
    private Map<String, BuildInfo> platforms;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class BuildInfo {
        private String fileName;
        private String checksum;
        private long fileSize;
        private String downloadUrl;
    }
}