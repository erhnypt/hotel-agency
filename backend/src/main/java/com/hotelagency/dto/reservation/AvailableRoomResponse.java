package com.hotelagency.dto.reservation;

import java.math.BigDecimal;

public record AvailableRoomResponse(
        Long roomTypeId,
        String name,
        String description,
        Integer capacity,
        String bedType,
        BigDecimal totalPrice,
        String currency) {
}
