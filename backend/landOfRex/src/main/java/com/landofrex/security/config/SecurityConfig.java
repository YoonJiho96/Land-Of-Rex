package com.landofrex.security.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.landofrex.security.jwt.JwtLogoutHandler;
import com.landofrex.security.jwt.filter.JwtFilter;
import com.landofrex.security.jwt.service.JwtService;
import com.landofrex.security.login.JsonAuthenticationFilter;
import com.landofrex.security.login.LoginFailureHandler;
import com.landofrex.security.login.LoginService;
import com.landofrex.security.login.LoginSuccessHandler;
import com.landofrex.security.oauth2.handler.OAuth2LoginFailureHandler;
import com.landofrex.security.oauth2.handler.OAuth2LoginSuccessHandler;
import com.landofrex.security.oauth2.service.CustomOAuth2UserService;
import com.landofrex.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true
)
@Slf4j
public class SecurityConfig {
    private final LoginSuccessHandler loginSuccessHandler;
    private final LoginFailureHandler loginFailureHandler;
    private final ObjectMapper objectMapper;


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
                        .requestMatchers(HttpMethod.POST,"/api/v1/auth/signup").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/patches").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/patches/latest").permitAll()
                        .requestMatchers("/api/v1/rankings","/api/v1/rankings/*").permitAll()
                        .requestMatchers("/api/v1/launcher/*").permitAll()
                        .requestMatchers("/api/v1/notices").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/notices/*").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/posts/**").permitAll()
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/v1/auth/username/exists").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/v1/auth/nickname/{nickname}/exists").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/patches").hasRole("ADMIN")
                        .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/favicon.ico", "/h2-console/**").permitAll()
                        .requestMatchers("/api/v1/auth/sign-up/oauth","/api/v1/auth/email").hasRole("GUEST")
                        .requestMatchers("/api/v1/auth/password/find").permitAll()
                        .requestMatchers("/api/v1/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/actuator/prometheus").permitAll()
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
                .addFilterBefore(jwtFilter(jwtService,userRepository), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jsonLoginFilter(), UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> {
                    logout.logoutUrl("/api/v1/auth/logout")
                            .addLogoutHandler(new JwtLogoutHandler(jwtService))
                            .logoutSuccessHandler((request, response, authentication) -> {
                                response.setStatus(HttpStatus.OK.value());
                            });
                });
        return http.build();
    }

    private final LoginService loginService;

    @Bean
    public JwtFilter jwtFilter(JwtService jwtService, UserRepository userRepository){
        return new JwtFilter(jwtService,userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString();
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return rawPassword.toString().equals(encodedPassword);
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(loginService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    public JsonAuthenticationFilter jsonLoginFilter() {
        JsonAuthenticationFilter filter = new JsonAuthenticationFilter(objectMapper);
        filter.setAuthenticationSuccessHandler(loginSuccessHandler);
        filter.setAuthenticationFailureHandler(loginFailureHandler);
        filter.setAuthenticationManager(authenticationManager());  // 주입받은 manager 사용
        return filter;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5500",
                "http://localhost:5173",
                "https://k11e102.p.ssafy.io",
                "http://local.p.ssafy.io:5500",
                "http://local.p.ssafy.io:5173"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"));
//        config.setAllowedMethods(Arrays.asList("GET","POST"));
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
    protected AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new CustomAuthenticationEntryPoint(objectMapper);
    }

    private static class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
        private final ObjectMapper objectMapper;

        private CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
            this.objectMapper = objectMapper;
        }

        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response,
                             AuthenticationException authException) throws IOException{
            // 인증되지 않은 사용자가 접근할 때 처리하는 로직
            String requestUri=request.getRequestURI();
            log.info("AuthenticationException: ",authException);
            //error 페이지로 이동
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());

            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

            // response body 작성
            objectMapper.writeValue(response.getWriter(), authException.getMessage());
            //http요청은 redirect해줄 수 있지만 fetch,axios 비동기 요청은 불가
           //response.sendRedirect("http://localhost:5500/login.html");
        }
    }
}
