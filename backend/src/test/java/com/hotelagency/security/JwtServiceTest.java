package com.hotelagency.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.exception.InvalidTokenException;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "test-secret-key-for-jwt-signing-must-be-long-enough",
                3_600_000L,
                604_800_000L);

        Role role = new Role(RoleName.AGENCY_STAFF);
        role.setId(1L);

        user = new User();
        user.setId(42L);
        user.setEmail("staff@example.com");
        user.setFullName("Test Staff");
        user.setRole(role);
    }

    @Test
    void generatesAndParsesAccessToken() {
        String token = jwtService.generateAccessToken(user);

        Claims claims = jwtService.parseClaims(token);

        assertThat(jwtService.extractEmail(claims)).isEqualTo("staff@example.com");
        assertThat(jwtService.isAccessToken(claims)).isTrue();
        assertThat(jwtService.isRefreshToken(claims)).isFalse();
        assertThat(claims.get("role", String.class)).isEqualTo("AGENCY_STAFF");
    }

    @Test
    void generatesAndParsesRefreshToken() {
        String token = jwtService.generateRefreshToken(user);

        Claims claims = jwtService.parseClaims(token);

        assertThat(jwtService.isRefreshToken(claims)).isTrue();
        assertThat(jwtService.isAccessToken(claims)).isFalse();
    }

    @Test
    void rejectsTamperedToken() {
        String token = jwtService.generateAccessToken(user) + "tampered";

        assertThatThrownBy(() -> jwtService.parseClaims(token))
                .isInstanceOf(InvalidTokenException.class);
    }

    @Test
    void rejectsTokenSignedWithDifferentKey() {
        JwtService otherService = new JwtService(
                "a-completely-different-secret-key-for-signing-tokens",
                3_600_000L,
                604_800_000L);
        String token = otherService.generateAccessToken(user);

        assertThatThrownBy(() -> jwtService.parseClaims(token))
                .isInstanceOf(InvalidTokenException.class);
    }
}
