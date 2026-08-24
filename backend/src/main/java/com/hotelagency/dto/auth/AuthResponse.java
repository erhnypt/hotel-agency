package com.hotelagency.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInMs,
        UserSummary user) {

    public AuthResponse(String accessToken, String refreshToken, long expiresInMs, UserSummary user) {
        this(accessToken, refreshToken, "Bearer", expiresInMs, user);
    }
}
