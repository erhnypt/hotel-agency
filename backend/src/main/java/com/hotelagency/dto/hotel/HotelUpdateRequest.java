package com.hotelagency.dto.hotel;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record HotelUpdateRequest(
        @NotBlank String name,
        String description,
        @NotBlank String address,
        @NotBlank String city,
        @NotBlank String country,
        @NotBlank String phone,
        @NotBlank @Email String email,
        String website,
        @NotBlank String contactPerson) {
}
