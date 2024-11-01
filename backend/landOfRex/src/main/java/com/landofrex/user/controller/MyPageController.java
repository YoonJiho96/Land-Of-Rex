package com.landofrex.user.controller;


import com.landofrex.security.AuthenticationUtil;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/my")
@RequiredArgsConstructor
public class MyPageController {
    private final UserRepository userRepository;

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

}
