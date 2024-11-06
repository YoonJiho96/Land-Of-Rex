//package com.landofrex.audit;
//
//
//import com.landofrex.security.jwt.CustomUserDetails;
//import com.landofrex.security.oauth2.CustomOAuth2User;
//import com.landofrex.user.entity.User;
//import com.landofrex.user.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.AuditorAware;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//public class AuditorAwareImpl implements AuditorAware<User> {
//  private final UserRepository userRepository;
//  @Override
//  public Optional<User> getCurrentAuditor() {
//    Authentication authentication = SecurityContextHolder.getContextHolderStrategy().getContext().getAuthentication();
//    if (authentication == null || !authentication.isAuthenticated()) {
//      throw new IllegalStateException("인증 정보가 유효하지 않거나 인증되지 않았습니다.");
//    }
//    Object principal = authentication.getPrincipal();
//
//    if (principal instanceof CustomUserDetails customUserDetails) {
//      return Optional.of(customUserDetails.getUser());
//    }else if(principal instanceof CustomOAuth2User customOAuth2User){
//      return userRepository.findById(customOAuth2User.getUserId());
//    }
//    throw new IllegalStateException("사용자 정보가 유효하지 않습니다.");
//  }
//}
