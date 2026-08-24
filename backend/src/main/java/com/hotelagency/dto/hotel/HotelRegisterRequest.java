package com.hotelagency.dto.hotel;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record HotelRegisterRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        @NotBlank String phone,
        @NotBlank String address,
        @NotBlank String city,
        @NotBlank String country,
        String description,
        @NotBlank String contactPerson) {
}
