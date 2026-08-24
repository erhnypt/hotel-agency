package com.hotelagency.dto.service;

import jakarta.validation.constraints.NotBlank;

public record ServiceRequest(@NotBlank String name, String description) {
}
