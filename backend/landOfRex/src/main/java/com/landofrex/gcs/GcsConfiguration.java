package com.landofrex.gcs;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class GcsConfiguration {

    @Value("${google.cloud.credentials.path}")
    private String credentialsFilePath;

    @Bean
    public Storage storage() throws IOException {
        Resource resource = new ClassPathResource(credentialsFilePath);
        try (InputStream inputStream = resource.getInputStream()) {
            return StorageOptions.newBuilder()
                    .setCredentials(ServiceAccountCredentials.fromStream(inputStream))
                    .build()
                    .getService();
        }
    }
}