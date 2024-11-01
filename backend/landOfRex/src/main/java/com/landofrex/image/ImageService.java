package com.landofrex.image;


import com.landofrex.gcs.GcsService;
import com.landofrex.post.PostRepository;
import com.landofrex.post.entity.Post;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService {
    private final GcsService gcsService;
    private final PostRepository postRepository;
    private final ImageRepository imageRepository;

    public void uploadImagesToPost(Post post, List<MultipartFile> imageFiles) throws IOException {
        CompletableFuture<List<String>> uploadFuture=gcsService.uploadImageFiles(imageFiles);
        //imageFiles 일부만 들어온 경우?
        uploadFuture.thenAccept(urls->{
            for (int i=0;i<urls.size();i++) {
                String imageFileName = imageFiles.get(i).getOriginalFilename();
                String url = urls.get(i);
                PostImage postImage = new PostImage(post,url,imageFileName);
                post.addImage(postImage);
                //imageRepository 사용하는 방법 고려
                //repository 없이 엔티티 생성 되는 부분 어색
            }
            postRepository.save(post);
        }).exceptionally(e->{
            //어떤 이유든 이미지 업로드 불가 시에도 게시글 등록 가능
            log.error(e.getMessage());
            return null;
        });
    }

//    @Transactional
//    public void uploadImage(MultipartFile imageFile) throws IOException {
//
//    }
}
