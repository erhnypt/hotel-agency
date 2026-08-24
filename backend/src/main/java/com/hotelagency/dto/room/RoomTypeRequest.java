package com.hotelagency.dto.room;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record RoomTypeRequest(
        @NotBlank String name,
        String description,
        @NotNull @Min(value = 1, message = "Capacity must be at least 1") Integer capacity,
        @NotNull @Min(value = 1, message = "Number of rooms must be at least 1") Integer numberOfRooms,
        @NotBlank String bedType,
        @DecimalMin(value = "0.0", inclusive = false, message = "Room size must be positive") BigDecimal roomSize) {
}
