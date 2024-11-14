package com.landofrex.aws;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class S3Config {

    private final S3Properties s3Properties;

    @Bean
    public AmazonS3 postImageS3Client() {
        return createS3Client(
                s3Properties.getS3().getPostImage().getAccessKey(),
                s3Properties.getS3().getPostImage().getSecretKey()
        );
    }

    @Bean
    public AmazonS3 appS3Client() {
        return createS3Client(
                s3Properties.getS3().getApp().getAccessKey(),
                s3Properties.getS3().getApp().getSecretKey()
        );
    }

    @Bean
    public AmazonS3 minIOClient() {
        return createMinIOClient(
                s3Properties.getS3().getMinIO().getAccessKey(),
                s3Properties.getS3().getMinIO().getSecretKey(),
                s3Properties.getRegion().getName()
        );
    }

    private AmazonS3 createS3Client(String accessKey, String secretKey) {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(s3Properties.getRegion().getName())
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }

    private AmazonS3 createMinIOClient(String accessKey, String secretKey, String region) {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration("http://localhost:9000",region))
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .enablePathStyleAccess()
                .build();
    }
}
