package com.landofrex.gcs;


import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class GcsService {

    private final Storage storage;

    @Value("${google.cloud.storage.bucket.name}")
    private String bucketName;

    private final String baseUrl="https://storage.googleapis.com/";

    private String generateFileUUID(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * 업로드한 이미지 파일들을 Google Cloud Storage에 저장하고 파일들의 URL 리스트를 반환합니다.
     *
     * @param ImageFiles 업로드할 이미지 파일 리스트 (MultipartFile 형식)
     * @return List<String> 업로드된 파일들의 URL 리스트
     * @throws IOException 파일을 업로드하는 동안 문제가 발생할 경우
     */
    public CompletableFuture<List<String>> uploadImageFiles(List<MultipartFile> ImageFiles) throws IOException{
        List<String> fileUrls = new ArrayList<>();
        for(MultipartFile imageFile : ImageFiles) {
            String imageUrlCloud=uploadImageFile(imageFile);
            fileUrls.add(imageUrlCloud);
        }
        return CompletableFuture.completedFuture(fileUrls);
    }

    private String uploadImageFile(MultipartFile imageFile) throws IOException {

        String fileName=generateFileUUID(imageFile.getOriginalFilename());
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName)
                .setContentType(imageFile.getContentType()).build();

        storage.create(blobInfo, imageFile.getBytes());

        StringBuilder fileUrlBuilder=new StringBuilder();

        fileUrlBuilder.append(baseUrl)
                .append(bucketName)
                .append("/")
                .append(fileName);
        return fileUrlBuilder.toString();
    }
}