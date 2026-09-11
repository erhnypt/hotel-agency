package com.hotelagency.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoomImageRequest(
        @NotBlank @Size(max = 6_000_000, message = "Görsel çok büyük") String imageUrl) {
}
