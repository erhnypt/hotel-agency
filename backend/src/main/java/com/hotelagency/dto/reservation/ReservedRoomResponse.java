package com.hotelagency.dto.reservation;

import java.math.BigDecimal;

/** A room line of a reservation: room type, quantity and snapshot price. */
public record ReservedRoomResponse(
        Long id,
        Long roomTypeId,
        String name,
        int quantity,
        BigDecimal nightlyPrice,
        BigDecimal lineTotal,
        String currency) {

    public static ReservedRoomResponse from(com.hotelagency.entity.ReservedRoom reservedRoom, long nights) {
        BigDecimal lineTotal = reservedRoom.getNightlyPrice()
                .multiply(BigDecimal.valueOf(reservedRoom.getQuantity()))
                .multiply(BigDecimal.valueOf(nights));
        return new ReservedRoomResponse(
                reservedRoom.getId(),
                reservedRoom.getRoomType().getId(),
                reservedRoom.getRoomTypeName(),
                reservedRoom.getQuantity(),
                reservedRoom.getNightlyPrice(),
                lineTotal,
                reservedRoom.getCurrency());
    }
}
