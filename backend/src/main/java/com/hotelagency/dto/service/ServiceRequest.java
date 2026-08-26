package com.hotelagency.dto.service;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ServiceRequest(
        @NotBlank String name,
        String description,
        @NotNull @PositiveOrZero(message = "Price cannot be negative") BigDecimal price,
        @NotBlank @Size(min = 3, max = 3, message = "Currency must be a 3-letter code") String currency) {
}
