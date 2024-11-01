package com.landofrex.security.jwt;


import com.landofrex.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {
    private final User user;
    private final List<GrantedAuthority> authorities;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        throw new UnsupportedOperationException("Only oauth no password");
    }

    @Override
    public String getUsername() {
        return this.user.getEmail();
    }

    public CustomUserDetails(User user, String... roles) {
        this.user=user;

        this.authorities = Arrays.stream(roles)
                .filter(role -> {
                    if (role.startsWith("ROLE_")) {
                        throw new IllegalArgumentException(role + " cannot start with ROLE_ (it is automatically added)");
                    }
                    return true; // 조건이 참일 경우 계속 진행
                })
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .collect(Collectors.toList());
    }
}
