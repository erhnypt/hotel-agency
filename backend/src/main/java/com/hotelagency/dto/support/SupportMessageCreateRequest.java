package com.hotelagency.dto.support;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupportMessageCreateRequest(@NotBlank @Size(max = 4000) String body) {
}
