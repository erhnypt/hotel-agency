package com.hotelagency.dto.bookingrequest;

import com.hotelagency.entity.BookingRequest;
import com.hotelagency.entity.BookingRequestStatus;
import java.time.Instant;
import java.time.LocalDate;

public record BookingRequestResponse(
        Long id,
        String propertyId,
        String propertyName,
        String hotelType,
        String propertyCity,
        String countryCode,
        String countryName,
        Long roomTypeId,
        String roomTypeName,
        LocalDate checkIn,
        LocalDate checkOut,
        Integer guests,
        String contactName,
        String contactEmail,
        String contactPhone,
        String message,
        BookingRequestStatus status,
        Instant createdAt,
        Instant updatedAt) {

    public static BookingRequestResponse from(BookingRequest r) {
        return new BookingRequestResponse(
                r.getId(),
                r.getPropertyId(),
                r.getPropertyName(),
                r.getHotelType(),
                r.getPropertyCity(),
                r.getCountryCode(),
                r.getCountryName(),
                r.getRoomTypeId(),
                r.getRoomTypeName(),
                r.getCheckIn(),
                r.getCheckOut(),
                r.getGuests(),
                r.getContactName(),
                r.getContactEmail(),
                r.getContactPhone(),
                r.getMessage(),
                r.getStatus(),
                r.getCreatedAt(),
                r.getUpdatedAt());
    }
}
