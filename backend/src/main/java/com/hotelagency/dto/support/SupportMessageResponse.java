package com.hotelagency.dto.support;

import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.SupportMessage;
import java.time.Instant;

public record SupportMessageResponse(
        Long id,
        Long hotelId,
        Long senderId,
        String senderName,
        RoleName senderRole,
        String body,
        Instant createdAt) {

    public static SupportMessageResponse from(SupportMessage message) {
        RoleName role = message.getSender().getRole().getName();
        return new SupportMessageResponse(
                message.getId(),
                message.getHotel().getId(),
                message.getSender().getId(),
                displayName(message.getSender().getFullName(), role),
                role,
                message.getBody(),
                message.getCreatedAt());
    }

    /**
     * The hotel sees the agency as one support team, not the individual staff
     * member's name — only the hotel's own contact name is shown as-is.
     */
    private static String displayName(String fullName, RoleName role) {
        return switch (role) {
            case HOTEL_ADMIN -> fullName;
            case AGENCY_ADMIN -> "Admin";
            case AGENCY_STAFF -> "Personel";
        };
    }
}
