package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.LoginRequest;
import com.hotelagency.dto.auth.RegisterRequest;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.exception.DuplicateResourceException;
import com.hotelagency.repository.RoleRepository;
import com.hotelagency.repository.UserRepository;
import com.hotelagency.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;

    private AuthService authService;

    private Role staffRole;

    @BeforeEach
    void setUp() {
        JwtService jwtService = new JwtService("test-secret-key-for-jwt-signing-must-be-long-enough", 3_600_000L, 604_800_000L);
        authService = new AuthService(userRepository, roleRepository, passwordEncoder, authenticationManager, jwtService);

        staffRole = new Role(RoleName.AGENCY_STAFF);
        staffRole.setId(2L);
    }

    @Test
    void registerCreatesUserWithHashedPasswordAndReturnsTokens() {
        RegisterRequest request = new RegisterRequest("new@example.com", "password123", "New User", RoleName.AGENCY_STAFF);

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.AGENCY_STAFF)).thenReturn(Optional.of(staffRole));
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        assertThat(savedUser.getEmail()).isEqualTo("new@example.com");
        assertThat(savedUser.getPasswordHash()).isEqualTo("hashed-password");
        assertThat(savedUser.getRole()).isEqualTo(staffRole);
        assertThat(response.accessToken()).isNotBlank();
        assertThat(response.refreshToken()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("new@example.com");
        assertThat(response.user().role()).isEqualTo(RoleName.AGENCY_STAFF);
    }

    @Test
    void registerRejectsDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("dup@example.com", "password123", "Dup User", RoleName.AGENCY_STAFF);
        when(userRepository.existsByEmail("dup@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void loginReturnsTokensForValidCredentials() {
        LoginRequest request = new LoginRequest("staff@example.com", "password123");

        User user = new User();
        user.setId(7L);
        user.setEmail("staff@example.com");
        user.setFullName("Staff");
        user.setRole(staffRole);

        when(userRepository.findByEmail("staff@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(request);

        verify(authenticationManager).authenticate(any());
        assertThat(response.accessToken()).isNotBlank();
        assertThat(response.user().id()).isEqualTo(7L);
    }

    @Test
    void loginPropagatesAuthenticationFailure() {
        LoginRequest request = new LoginRequest("staff@example.com", "wrong-password");
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad credentials"));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
