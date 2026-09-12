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
        return new SupportMessageResponse(
                message.getId(),
                message.getHotel().getId(),
                message.getSender().getId(),
                message.getSender().getFullName(),
                message.getSender().getRole().getName(),
                message.getBody(),
                message.getCreatedAt());
    }
}
