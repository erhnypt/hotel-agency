package com.hotelagency.dto.availability;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

public record RoomAvailabilityRequest(
        @NotNull LocalDate date,
        @NotNull @PositiveOrZero(message = "Available rooms cannot be negative") Integer availableRooms) {
}
