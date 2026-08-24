package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.LoginRequest;
import com.hotelagency.dto.auth.RegisterRequest;
import com.hotelagency.dto.auth.UserSummary;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtService;
import com.hotelagency.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @Test
    void registerReturns201WithTokens() throws Exception {
        UserSummary userSummary = new UserSummary(1L, "new@example.com", "New User", RoleName.AGENCY_STAFF);
        AuthResponse authResponse = new AuthResponse("access-token", "refresh-token", 3_600_000L, userSummary);
        when(authService.register(any())).thenReturn(authResponse);

        RegisterRequest request = new RegisterRequest("new@example.com", "password123", "New User", RoleName.AGENCY_STAFF);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.user.email").value("new@example.com"));
    }

    @Test
    void registerRejectsInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest("not-an-email", "password123", "New User", RoleName.AGENCY_STAFF);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.email").exists());
    }

    @Test
    void registerRejectsShortPassword() throws Exception {
        RegisterRequest request = new RegisterRequest("new@example.com", "short", "New User", RoleName.AGENCY_STAFF);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    void loginReturns200WithTokens() throws Exception {
        UserSummary userSummary = new UserSummary(1L, "staff@example.com", "Staff", RoleName.AGENCY_STAFF);
        AuthResponse authResponse = new AuthResponse("access-token", "refresh-token", 3_600_000L, userSummary);
        when(authService.login(any())).thenReturn(authResponse);

        LoginRequest request = new LoginRequest("staff@example.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("staff@example.com"));
    }
}
