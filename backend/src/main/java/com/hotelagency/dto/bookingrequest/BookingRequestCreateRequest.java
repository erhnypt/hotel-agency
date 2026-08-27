package com.hotelagency.dto.bookingrequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record BookingRequestCreateRequest(
        @NotBlank @Size(max = 64) String propertyId,
        @NotBlank @Size(max = 255) String propertyName,
        @NotBlank @Size(max = 32) String hotelType,
        @Size(max = 128) String propertyCity,
        @Size(max = 3) String countryCode,
        @Size(max = 128) String countryName,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @NotNull @Min(1) Integer guests,
        @NotBlank @Size(max = 255) String contactName,
        @NotBlank @Email @Size(max = 255) String contactEmail,
        @NotBlank @Size(max = 50) String contactPhone,
        @Size(max = 2000) String message) {
}
