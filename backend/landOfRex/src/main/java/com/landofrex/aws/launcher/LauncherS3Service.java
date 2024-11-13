package com.landofrex.aws.launcher;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ResponseHeaderOverrides;
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
public class LauncherS3Service {
    private final AmazonS3 amazonS3;
    private final S3Properties s3Properties;

    public LauncherS3Service(
            @Qualifier("appS3Client") AmazonS3 amazonS3,
            S3Properties s3Properties
    ) {
        this.amazonS3 = amazonS3;
        this.s3Properties = s3Properties;
    }

    public String generateSignedUrl(String objectKey) {
        Date expiration = new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(30));
        String bucket = s3Properties.getS3().getApp().getBucket();

        String filename = objectKey.substring(objectKey.lastIndexOf('/') + 1);

        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiration);

        ResponseHeaderOverrides headerOverrides = new ResponseHeaderOverrides()
                .withContentType("application/octet-stream")
                .withContentDisposition("attachment; filename=\""+filename+"\"");

        generatePresignedUrlRequest.setResponseHeaders(headerOverrides);

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

}