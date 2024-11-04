package com.landofrex.security.config;


import com.landofrex.security.jwt.filter.JwtFilter;
import com.landofrex.security.jwt.service.JwtService;
import com.landofrex.security.oauth2.handler.OAuth2LoginFailureHandler;
import com.landofrex.security.oauth2.handler.OAuth2LoginSuccessHandler;
import com.landofrex.security.oauth2.service.CustomOAuth2UserService;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtService jwtService,
                                           UserRepository userRepository,
                                           CustomOAuth2UserService customOAuth2UserService) throws Exception {

        http.cors(cors -> corsConfigurationSource())
                .csrf(AbstractHttpConfigurer::disable)
                .headers((headerConfig)->
                        headerConfig.frameOptions((HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                        ))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize->authorize
                        .requestMatchers(HttpMethod.GET,"/api/v1/patches/latest").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/patches").hasRole("ADMIN")
                        .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/favicon.ico", "/h2-console/**").permitAll()
                        .requestMatchers("/api/v1/auth/sign-up","/api/v1/auth/email").hasRole("GUEST")
                        .requestMatchers("/api/v1/**").hasRole("USER")
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oAuth2LoginSuccessHandler(jwtService))
                        .failureHandler(oAuth2LoginFailureHandler())
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)))
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling.authenticationEntryPoint(customAuthenticationEntryPoint())
                )
                .addFilterBefore(jwtAuthenticationProcessingFilter(jwtService,userRepository), LogoutFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5500",
                "http://localhost:5173",
                "https://j11e103.p.ssafy.io",
                "http://local.p.ssafy.io:5500",
                "http://local.p.ssafy.io:5173"
        ));
//        config.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedMethods(Arrays.asList("GET","POST"));
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    protected OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler(JwtService jwtService) {
        return new OAuth2LoginSuccessHandler(jwtService);
    }

    @Bean
    protected OAuth2LoginFailureHandler oAuth2LoginFailureHandler() {
        return new OAuth2LoginFailureHandler();
    }

    @Bean
    protected JwtFilter jwtAuthenticationProcessingFilter(JwtService jwtService, UserRepository userRepository) throws Exception {
        return new JwtFilter(jwtService,userRepository);
    }

    @Bean
    protected AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint();
    }

    private static class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response,
                             AuthenticationException authException) throws IOException{
            // 인증되지 않은 사용자가 접근할 때 처리하는 로직
            String requestUri=request.getRequestURI();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            //http요청은 redirect해줄 수 있지만 fetch,axios 비동기 요청은 불가
           //response.sendRedirect("http://localhost:5500/login.html");
        }
    }
}
