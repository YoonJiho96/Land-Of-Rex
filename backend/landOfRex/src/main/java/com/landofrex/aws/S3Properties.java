package com.landofrex.aws;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "cloud.aws")
public class S3Properties {
    private final Region region = new Region();
    private final S3 s3 = new S3();

    @Getter
    @Setter
    public static class Region {
        private String name;
    }

    @Getter
    @Setter
    public static class S3 {
        private BucketConfig postImage = new BucketConfig();
        private BucketConfig app = new BucketConfig();
    }

    @Getter
    @Setter
    public static class BucketConfig {
        private String accessKey;
        private String secretKey;
        private String bucket;
        private String bucketUrl;
    }
}