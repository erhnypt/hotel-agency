package com.hotelagency.dto.availability;

import com.hotelagency.entity.RoomAvailability;
import java.time.Instant;
import java.time.LocalDate;

public record RoomAvailabilityResponse(
        Long id, Long roomTypeId, LocalDate date, Integer availableRooms, Instant updatedAt) {

    public static RoomAvailabilityResponse from(RoomAvailability availability) {
        return new RoomAvailabilityResponse(
                availability.getId(),
                availability.getRoomType().getId(),
                availability.getDate(),
                availability.getAvailableRooms(),
                availability.getUpdatedAt());
    }
}
