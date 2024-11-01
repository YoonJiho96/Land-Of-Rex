// package com.landofrex;


// import com.landofrex.security.jwt.filter.JwtFilter;
// import com.landofrex.security.jwt.service.JwtService;
// import com.landofrex.security.jwt.token.AccessToken;
// import com.landofrex.security.jwt.token.Token;
// import com.landofrex.security.jwt.token.TokenType;
// import com.landofrex.user.entity.Role;
// import com.landofrex.user.entity.SocialType;
// import com.landofrex.user.entity.User;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.http.MediaType;
// import org.springframework.security.test.context.support.WithMockUser;
// import org.springframework.test.context.DynamicPropertyRegistry;
// import org.springframework.test.context.DynamicPropertySource;
// import org.springframework.test.web.servlet.MockMvc;

// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// @SpringBootTest
// @AutoConfigureMockMvc
// public class JwtFilterTest {

//     @Mock
//     private JwtService jwtService;

//     @InjectMocks
//     private JwtFilter jwtFilter;

//     @Autowired
//     private MockMvc mockMvc;

//     private final User user=User.builder()
//             .id(1L)
//             .email("test@gmail.com")
//             .role(Role.USER)
//             .socialType(SocialType.GOOGLE)
//             .build();

//     @BeforeEach
//     public void setup() {
//         // 유효기간이 지난 토큰 값 설정

//     }

//     @DynamicPropertySource
//     static void dynamicProperties(DynamicPropertyRegistry registry) {
//         registry.add("jwt.access.expiration", () -> -1000L); // 테스트에서 만료된 토큰 생성
//     }

//     private Token createExpiredToken(TokenType tokenType, User user){
//         if(tokenType.name().equals(TokenType.ACCESS)){
//             return jwtService.createAccessToken(user.getEmail(),user.getId());
//         }else if(tokenType.name().equals(TokenType.REFRESH)){
//             return jwtService.createRefreshToken(user.getId());
//         }
//         throw new IllegalArgumentException("Unsupported token type");
//     }

//     @Test
//     @WithMockUser // Mock user로 인증된 사용자 설정
//     public void whenAccessTokenIsExpired_thenAuthenticationEntryPointShouldHandle() throws Exception {

//         //로그인 시 생성되는 로직 그대로 쓰지만 시간만 조작
//         AccessToken expiredAccessToken = (AccessToken) createExpiredToken(TokenType.ACCESS,user);


//         mockMvc.perform(get("/email")
//                         .cookie() // 만료된 액세스 토큰 쿠키 추가
//                         .contentType(MediaType.APPLICATION_JSON))
//                 .andExpect(status().isUnauthorized()); // 만료된 토큰에 대한 적절한 응답 코드 확인
//     }
// }