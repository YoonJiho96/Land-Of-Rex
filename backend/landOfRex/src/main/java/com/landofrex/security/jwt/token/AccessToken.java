package com.landofrex.security.jwt.token;

import lombok.Getter;

@Getter
public class AccessToken extends Token{
    public AccessToken(String tokenValue) {
        super(tokenValue);
    }
}
