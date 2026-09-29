package com.hotelagency.dto.reservation;

import java.math.BigDecimal;

/** A hotel service booked together with a reservation (snapshotted name/price). */
public record ReservedServiceResponse(
        Long id,
        Long serviceId,
        String name,
        BigDecimal unitPrice,
        String currency) {

    public static ReservedServiceResponse from(com.hotelagency.entity.ReservedService reservedService) {
        return new ReservedServiceResponse(
                reservedService.getId(),
                reservedService.getService().getId(),
                reservedService.getServiceName(),
                reservedService.getUnitPrice(),
                reservedService.getCurrency());
    }
}
