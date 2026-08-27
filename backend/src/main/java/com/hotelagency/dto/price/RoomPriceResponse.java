package com.hotelagency.dto.price;

import com.hotelagency.entity.RoomType;
import java.math.BigDecimal;

public record RoomPriceResponse(Long roomTypeId, BigDecimal basePrice, String currency) {

    public static RoomPriceResponse from(RoomType roomType) {
        return new RoomPriceResponse(roomType.getId(), roomType.getBasePrice(), roomType.getCurrency());
    }
}
