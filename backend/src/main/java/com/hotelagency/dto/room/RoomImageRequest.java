package com.hotelagency.dto.room;

import jakarta.validation.constraints.NotBlank;

public record RoomImageRequest(@NotBlank String imageUrl) {
}
