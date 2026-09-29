package com.hotelagency.dto.reservation;

import com.hotelagency.dto.customer.CustomerRequest;
import com.hotelagency.dto.reservation.ReservedRoomRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record ReservationCreateRequest(
        @NotNull Long hotelId,
        /** Legacy single-room field; used when {@code rooms} is empty. */
        @NotNull Long roomTypeId,
        @NotNull LocalDate checkIn,
        @NotNull LocalDate checkOut,
        @NotNull @Min(1) Integer guests,
        Long customerId,
        @Valid CustomerRequest newCustomer,
        /** Room lines to book (room type + quantity); supports several room types in one reservation. */
        @Valid List<ReservedRoomRequest> rooms,
        /** Optional hotel services (amenities) to book together with the stay. */
        List<Long> serviceIds) {
}
