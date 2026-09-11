package com.hotelagency.dto.hotel;

import com.hotelagency.entity.Hotel;
import java.time.Instant;

public record IncompleteHotelSetupResponse(
        Long hotelId,
        String hotelName,
        String hotelEmail,
        Instant approvedAt,
        Instant lastReminderSentAt) {

    public static IncompleteHotelSetupResponse from(Hotel hotel) {
        return new IncompleteHotelSetupResponse(
                hotel.getId(),
                hotel.getName(),
                hotel.getEmail(),
                hotel.getApprovedAt(),
                hotel.getSetupReminderSentAt());
    }
}
