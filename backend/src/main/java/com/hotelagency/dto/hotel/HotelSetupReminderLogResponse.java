package com.hotelagency.dto.hotel;

import com.hotelagency.entity.HotelSetupReminderLog;
import java.time.Instant;

public record HotelSetupReminderLogResponse(
        Long id,
        Long hotelId,
        String hotelName,
        String recipients,
        Instant sentAt) {

    public static HotelSetupReminderLogResponse from(HotelSetupReminderLog log) {
        return new HotelSetupReminderLogResponse(
                log.getId(),
                log.getHotel().getId(),
                log.getHotel().getName(),
                log.getRecipients(),
                log.getSentAt());
    }
}
