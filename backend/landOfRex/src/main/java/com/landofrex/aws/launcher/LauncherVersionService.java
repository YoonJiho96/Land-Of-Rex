package com.landofrex.aws.launcher;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.landofrex.aws.S3Properties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class LauncherVersionService {
    private final AmazonS3 amazonS3;
    private final S3Properties s3Properties;
    private final ObjectMapper objectMapper;

    public LauncherVersionService(
            @Qualifier("appS3Client") AmazonS3 amazonS3,
            S3Properties s3Properties
    ) {
        this.amazonS3 = amazonS3;
        this.s3Properties = s3Properties;
        this.objectMapper = new ObjectMapper();
    }

    public LauncherVersion getLatestVersion() {
        try {
            String bucket = s3Properties.getS3().getApp().getBucket();
            S3Object versionFile = amazonS3.getObject(bucket, "versions.json");

            // versions.json 파일 읽기
            JsonNode versionsJson = objectMapper.readTree(versionFile.getObjectContent());
            JsonNode latestVersion = versionsJson.get("latest");

            // JSON을 LauncherVersion 객체로 변환
            LauncherVersion launcherVersion = objectMapper.treeToValue(latestVersion, LauncherVersion.class);

            // 각 플랫폼별 다운로드 URL 생성
            if (launcherVersion.getPlatforms() != null) {
                launcherVersion.getPlatforms().forEach((platform, buildInfo) -> {
                    String signedUrl = generateSignedUrl(buildInfo.getFileName());
                    buildInfo.setDownloadUrl(signedUrl);
                });
            }

            return launcherVersion;

        } catch (IOException e) {
            log.error("Error parsing versions.json", e);
            throw new RuntimeException("Failed to parse version information");
        } catch (Exception e) {
            log.error("Error fetching latest version", e);
            throw new RuntimeException("Failed to fetch latest version");
        }
    }

    private String generateSignedUrl(String objectKey) {
        Date expiration = new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(30));
        String bucket = s3Properties.getS3().getApp().getBucket();

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);
        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    // 특정 플랫폼의 최신 버전 정보 조회
    public LauncherVersion.BuildInfo getLatestVersionForPlatform(String platform) {
        LauncherVersion latest = getLatestVersion();
        if (latest.getPlatforms() != null && latest.getPlatforms().containsKey(platform)) {
            return latest.getPlatforms().get(platform);
        }
        throw new RuntimeException("No version information available for platform: " + platform);
    }

    // 버전 비교 메서드
    public boolean isNewVersionAvailable(String currentVersion, String platform) {
        try {
            LauncherVersion latest = getLatestVersion();
            if (latest.getPlatforms() != null && latest.getPlatforms().containsKey(platform)) {
                // 버전 문자열 비교 (예: "1.2.0" > "1.1.0")
                return compareVersions(latest.getVersion(), currentVersion) > 0;
            }
            return false;
        } catch (Exception e) {
            log.error("Error checking for new version", e);
            return false;
        }
    }

    private int compareVersions(String version1, String version2) {
        String[] v1Parts = version1.split("\\.");
        String[] v2Parts = version2.split("\\.");

        int length = Math.max(v1Parts.length, v2Parts.length);
        for (int i = 0; i < length; i++) {
            int v1 = i < v1Parts.length ? Integer.parseInt(v1Parts[i]) : 0;
            int v2 = i < v2Parts.length ? Integer.parseInt(v2Parts[i]) : 0;

            if (v1 != v2) {
                return v1 - v2;
            }
        }
        return 0;
    }
}