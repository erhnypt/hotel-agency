package com.hotelagency.dto.price;

import com.hotelagency.entity.RoomPrice;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record RoomPriceResponse(
        Long id, Long roomTypeId, LocalDate date, BigDecimal price, String currency, Instant updatedAt) {

    public static RoomPriceResponse from(RoomPrice roomPrice) {
        return new RoomPriceResponse(
                roomPrice.getId(),
                roomPrice.getRoomType().getId(),
                roomPrice.getDate(),
                roomPrice.getPrice(),
                roomPrice.getCurrency(),
                roomPrice.getUpdatedAt());
    }
}
