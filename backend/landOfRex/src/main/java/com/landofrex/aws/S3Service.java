package com.landofrex.aws;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public CompletableFuture<List<String>> uploadImageFiles(List<MultipartFile> ImageFiles) throws IOException{
        List<String> fileUrls = new ArrayList<>();
        for(MultipartFile imageFile : ImageFiles) {
            String imageUrlCloud=uploadImageFile(imageFile);
            fileUrls.add(imageUrlCloud);
        }
        return CompletableFuture.completedFuture(fileUrls);
    }

    private String uploadImageFile(MultipartFile file) {
        try {
            String fileName = createFileName(file.getOriginalFilename());
            String fileUrl = "";

            // 파일 형식 검증
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());

            // S3에 업로드
            amazonS3Client.putObject(
                    new PutObjectRequest(bucket, fileName, file.getInputStream(), objectMetadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead)
            );

            fileUrl = amazonS3Client.getUrl(bucket, fileName).toString();
            return fileUrl;

        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }

    // 이미지 삭제
    public void deleteImage(String fileUrl) {
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            amazonS3Client.deleteObject(bucket, fileName);
        } catch (Exception e) {
            log.error("이미지 삭제 실패", e);
            throw new RuntimeException("이미지 삭제에 실패했습니다.");
        }
    }

    // 파일명 생성 (UUID + 원본 파일명)
    private String createFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

    // 파일 형식 검증
    private void validateFileExists(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다.");
        }
    }
}