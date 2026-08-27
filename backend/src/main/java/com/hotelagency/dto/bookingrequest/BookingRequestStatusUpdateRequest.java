package com.hotelagency.dto.bookingrequest;

import com.hotelagency.entity.BookingRequestStatus;
import jakarta.validation.constraints.NotNull;

public record BookingRequestStatusUpdateRequest(@NotNull BookingRequestStatus status) {
}
