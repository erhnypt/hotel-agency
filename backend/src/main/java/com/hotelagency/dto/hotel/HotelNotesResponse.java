package com.hotelagency.dto.hotel;

import com.hotelagency.entity.Hotel;
import java.time.Instant;

/**
 * Agency-admin-only private notes for a hotel. Never exposed to hotel admins,
 * staff, or the public site — the endpoint that serves this is admin-gated.
 */
public record HotelNotesResponse(
        Long hotelId,
        String adminNotes,
        Instant updatedAt) {

    public static HotelNotesResponse from(Hotel hotel) {
        return new HotelNotesResponse(hotel.getId(), hotel.getAdminNotes(), hotel.getUpdatedAt());
    }
}
