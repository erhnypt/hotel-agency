package com.hotelagency.dto.reservation;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** One requested room line: a room type of the hotel and how many rooms of it. */
public record ReservedRoomRequest(
        @NotNull Long roomTypeId,
        @Min(1) @Max(20) int quantity) {
}
