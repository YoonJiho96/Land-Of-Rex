package com.landofrex.security.jwt.token;

public enum TokenType {
    ACCESS("accessToken"),
    REFRESH("refreshToken");

    private final String type;

    TokenType(String type) {
        this.type = type;
    }

    public static TokenType fromValue(String value) {
        for (TokenType tokenType : TokenType.values()) {
            if (tokenType.name().equals(value)) {
                return tokenType;
            }
        }
        return null; // 일치하는 타입이 없을 경우 null 반환
    }

}
