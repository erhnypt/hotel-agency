package com.hotelagency.dto.hotel;

import jakarta.validation.constraints.Size;

public record HotelNotesUpdateRequest(
        @Size(max = 4000, message = "Notes cannot exceed 4000 characters") String adminNotes) {
}
