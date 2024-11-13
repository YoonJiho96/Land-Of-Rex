package com.landofrex.aws;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class ImageS3Service {
    private final AmazonS3 amazonS3;
    private final S3Properties s3Properties;

    public ImageS3Service(
            @Qualifier("appS3Client") AmazonS3 amazonS3,
            S3Properties s3Properties
    ) {
        this.amazonS3 = amazonS3;
        this.s3Properties = s3Properties;
    }


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

            // 파일 형식 검증
            ObjectMetadata objectMetadata = new ObjectMetadata();
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(file.getSize());

            // S3에 업로드
            String bucket = s3Properties.getS3().getPostImage().getBucket();

            amazonS3.putObject(
                    new PutObjectRequest(bucket, fileName, file.getInputStream(), objectMetadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead) // 필요한 경우 접근 권한 설정
            );

            return s3Properties.getS3().getPostImage().getBucketUrl() + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
        }
    }

    // 이미지 삭제
    public void deleteImage(String fileUrl) {
        try {
            String bucket = s3Properties.getS3().getPostImage().getBucket();
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            amazonS3.deleteObject(bucket, fileName);
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