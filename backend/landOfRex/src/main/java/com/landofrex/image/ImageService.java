package com.landofrex.image;


import com.landofrex.aws.ImageS3Service;
import com.landofrex.image.entity.PostImage;
import com.landofrex.post.BasePostRepository;
import com.landofrex.post.controller.PostUpdateRequest;
import com.landofrex.post.entity.BasePost;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {
    private final ImageS3Service s3Service;
    private final BasePostRepository basePostRepository;
    private final ImageRepository imageRepository;

    @Transactional
    public void uploadImages(BasePost basePost, List<MultipartFile> imageFiles,List<Integer> imageOrders) throws IOException {

        CompletableFuture<List<String>> uploadFuture = s3Service.uploadImageFiles(imageFiles);

        uploadFuture.thenAccept(urls -> {
            for (int i = 0; i < urls.size(); i++) {
                String imageFileName = imageFiles.get(i).getOriginalFilename();
                String url = urls.get(i);
                PostImage postImage = new PostImage(basePost, url, imageFileName, imageOrders.get(i));
                basePost.addImage(postImage);
            }
            basePostRepository.save(basePost);
        }).exceptionally(e -> {
            log.error("Failed to upload images for new post: {}", e.getMessage());
            return null;
        });
    }

    @Transactional
    public void uploadImages(Long postId, List<MultipartFile> imageFiles,List<Integer> imageOrders) throws IOException {

        BasePost foundPost=basePostRepository.findById(postId).orElseThrow(EntityNotFoundException::new);
        uploadImages(foundPost,imageFiles,imageOrders);
    }

    @Transactional
    public void uploadImages(BasePost newPost, List<MultipartFile> imageFiles) throws IOException{
        List<Integer> orders = IntStream.range(0, imageFiles.size())
                .boxed()
                .toList();
        uploadImages(newPost,imageFiles,orders);
    }

    @Transactional
    public void updateImageOrders(Long postId,List<PostUpdateRequest.ImageOrder> imageOrders){
        List<PostImage> postImages = imageRepository.findByPostId(postId);

        // ID를 키로 하는 Map 생성하여 조회 성능 개선
        Map<Long, PostImage> imageMap = postImages.stream()
                .collect(Collectors.toMap(PostImage::getId, image -> image));

        // 순서 업데이트
        for (PostUpdateRequest.ImageOrder imageOrder : imageOrders) {
            PostImage postImage = imageMap.get(imageOrder.getId());
            if (postImage != null) {
                postImage.updateSequence(imageOrder.getSequence());
            }
        }
    }
}
