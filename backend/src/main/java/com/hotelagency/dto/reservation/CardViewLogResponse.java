package com.hotelagency.dto.reservation;

import com.hotelagency.entity.CardViewLog;
import java.time.Instant;

public record CardViewLogResponse(
        Long id,
        Long reservationId,
        String reservationNumber,
        Long hotelId,
        String hotelName,
        String customerName,
        String viewedByName,
        Instant viewedAt) {

    public static CardViewLogResponse from(CardViewLog log) {
        return new CardViewLogResponse(
                log.getId(),
                log.getReservation().getId(),
                log.getReservation().getReservationNumber(),
                log.getReservation().getHotel().getId(),
                log.getReservation().getHotel().getName(),
                log.getReservation().getCustomer().getFirstName() + " " + log.getReservation().getCustomer().getLastName(),
                log.getViewedBy().getFullName(),
                log.getViewedAt());
    }
}
