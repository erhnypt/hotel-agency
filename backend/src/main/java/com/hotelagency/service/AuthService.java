package com.hotelagency.service;

import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.LoginRequest;
import com.hotelagency.dto.auth.RefreshRequest;
import com.hotelagency.dto.auth.RegisterRequest;
import com.hotelagency.dto.auth.UserSummary;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.User;
import com.hotelagency.exception.DuplicateResourceException;
import com.hotelagency.exception.InvalidTokenException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoleRepository;
import com.hotelagency.repository.UserRepository;
import com.hotelagency.security.JwtService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

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

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return new AuthResponse(accessToken, refreshToken, jwtService.getAccessExpirationMs(), UserSummary.from(user));
    }
}
