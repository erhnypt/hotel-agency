package com.hotelagency.dto.reservation;

import com.hotelagency.dto.customer.CustomerResponse;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.ReservationStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record ReservationResponse(
        Long id,
        String reservationNumber,
        Long hotelId,
        String hotelName,
        Long roomTypeId,
        String roomTypeName,
        CustomerResponse customer,
        LocalDate checkIn,
        LocalDate checkOut,
        Integer guests,
        BigDecimal totalPrice,
        String currency,
        ReservationStatus status,
        Instant createdAt,
        Instant updatedAt) {

    public static ReservationResponse from(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getReservationNumber(),
                reservation.getHotel().getId(),
                reservation.getHotel().getName(),
                reservation.getRoomType().getId(),
                reservation.getRoomType().getName(),
                CustomerResponse.from(reservation.getCustomer()),
                reservation.getCheckIn(),
                reservation.getCheckOut(),
                reservation.getGuests(),
                reservation.getTotalPrice(),
                reservation.getCurrency(),
                reservation.getStatus(),
                reservation.getCreatedAt(),
                reservation.getUpdatedAt());
    }
}
