package com.hotelagency.dto.reservation;

import com.hotelagency.dto.customer.CustomerRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record ReservationCreateRequest(
        @NotNull Long hotelId,
        @NotNull Long roomTypeId,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @NotNull @Min(1) Integer guests,
        Long customerId,
        @Valid CustomerRequest newCustomer,
        /** Optional hotel services (amenities) to book together with the stay. */
        List<Long> serviceIds) {
}
