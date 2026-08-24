package com.hotelagency.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank String fullName,
        String currentPassword,
        @Size(min = 8) String newPassword) {}
