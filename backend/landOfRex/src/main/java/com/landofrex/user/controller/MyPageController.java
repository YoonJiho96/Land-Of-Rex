package com.landofrex.user.controller;


import com.landofrex.post.GeneralPostService;
import com.landofrex.post.controller.GeneralPostDto;
import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
public class MyPageController {
    private final UserRepository userRepository;
    private final GeneralPostService generalPostService;

    @GetMapping("/info")
    public ResponseEntity<MyInfo> getMyInfo() {
        User user= AuthenticationUtil.getUser();
        return ResponseEntity.ok(new MyInfo(user));
    }

    @PatchMapping("/info")
    public ResponseEntity<MyInfo> updateMyInfo(@RequestBody MyInfo myInfo) {
        User user= AuthenticationUtil.getUser();
        User updatedUser =userRepository.save(user);
        return ResponseEntity.ok(new MyInfo(updatedUser));
    }

    @GetMapping("/posts")
    public ResponseEntity<GeneralPostDto.PageResponse>  getMyPosts(@RequestParam int page, @RequestParam int size) {
        User user=AuthenticationUtil.getUser();
        Pageable pageable=PageRequest.of(page, size, Sort.by("createdAt").descending());
        GeneralPostDto.PageResponse response=new GeneralPostDto.PageResponse(generalPostService.getMyPosts(user.getId(),pageable));
        return ResponseEntity.ok(response);
    }

}
