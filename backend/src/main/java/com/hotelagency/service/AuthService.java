package com.hotelagency.service;

import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.ForgotPasswordRequest;
import com.hotelagency.dto.auth.LoginRequest;
import com.hotelagency.dto.auth.RefreshRequest;
import com.hotelagency.dto.auth.RegisterRequest;
import com.hotelagency.dto.auth.ResetPasswordRequest;
import com.hotelagency.dto.auth.UpdateProfileRequest;
import com.hotelagency.dto.auth.UserSummary;
import com.hotelagency.entity.PasswordResetToken;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.User;
import com.hotelagency.exception.DuplicateResourceException;
import com.hotelagency.exception.InvalidTokenException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.PasswordResetTokenRepository;
import com.hotelagency.repository.RoleRepository;
import com.hotelagency.repository.UserRepository;
import com.hotelagency.security.JwtService;
import io.jsonwebtoken.Claims;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int RESET_TOKEN_VALIDITY_MINUTES = 30;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email is already registered: " + request.email());
        }

        Role role = roleRepository.findByName(request.role())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.role()));

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(role);
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.email()));

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshRequest request) {
        Claims claims = jwtService.parseClaims(request.refreshToken());
        if (!jwtService.isRefreshToken(claims)) {
            throw new InvalidTokenException("Provided token is not a refresh token");
        }

        String email = jwtService.extractEmail(claims);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return buildAuthResponse(user);
    }

    @Transactional
    public UserSummary updateProfile(User user, UpdateProfileRequest request) {
        user.setFullName(request.fullName());

        if (request.newPassword() != null && !request.newPassword().isBlank()) {
            if (request.currentPassword() == null
                    || !passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
                throw new IllegalArgumentException("Mevcut şifre hatalı");
            }
            user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        }

        return UserSummary.from(userRepository.save(user));
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            String rawToken = generateRawToken();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTokenHash(hashToken(rawToken));
            resetToken.setExpiresAt(Instant.now().plus(RESET_TOKEN_VALIDITY_MINUTES, ChronoUnit.MINUTES));
            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + rawToken;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });
        // Always return silently, whether or not the email is registered, so the
        // endpoint can't be used to enumerate which addresses have an account.
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(hashToken(request.token()))
                .orElseThrow(() -> new InvalidTokenException("Şifre sıfırlama bağlantısı geçersiz"));

        if (resetToken.getUsedAt() != null || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidTokenException("Şifre sıfırlama bağlantısının süresi dolmuş");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(rawToken.getBytes()));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(accessToken, refreshToken, jwtService.getAccessExpirationMs(), UserSummary.from(user));
    }
}
