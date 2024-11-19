package com.landofrex.security.jwt.token;

import lombok.Getter;

@Getter
public abstract class Token {
    protected String tokenValue;

    public Token(String tokenValue) {
        this.tokenValue = tokenValue;
    }

}
