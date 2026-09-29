package com.hotelagency.dto.reservation;

import com.hotelagency.dto.customer.CustomerResponse;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.ReservationStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

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
        boolean paid,
        Instant paidAt,
        Long createdByUserId,
        List<ReservedServiceResponse> services,
        Instant createdAt,
        Instant updatedAt) {

    public static ReservationResponse from(Reservation reservation) {
        return from(reservation, false);
    }

    /** When {@code maskCard} is true, the customer's card number/expiry/CVV are masked — used for hotels. */
    public static ReservationResponse from(Reservation reservation, boolean maskCard) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getReservationNumber(),
                reservation.getHotel().getId(),
                reservation.getHotel().getName(),
                reservation.getRoomType().getId(),
                reservation.getRoomType().getName(),
                maskCard ? CustomerResponse.masked(reservation.getCustomer()) : CustomerResponse.from(reservation.getCustomer()),
                reservation.getCheckIn(),
                reservation.getCheckOut(),
                reservation.getGuests(),
                reservation.getTotalPrice(),
                reservation.getCurrency(),
                reservation.getStatus(),
                reservation.isPaid(),
                reservation.getPaidAt(),
                reservation.getCreatedBy().getId(),
                reservation.getServices().stream().map(ReservedServiceResponse::from).toList(),
                reservation.getCreatedAt(),
                reservation.getUpdatedAt());
    }
}
