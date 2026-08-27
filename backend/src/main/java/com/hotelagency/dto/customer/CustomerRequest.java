package com.hotelagency.dto.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String phone,
        @Email String email,
        String passportNumber,
        String nationality,
        String notes,
        // Card on file — masked fields only. The API rejects anything that is not
        // already reduced to brand + last 4 + expiry on the client.
        @Size(max = 255) String cardHolder,
        @Size(max = 20) String cardBrand,
        @Pattern(regexp = "\\d{4}", message = "cardLast4 must be exactly 4 digits") String cardLast4,
        @Pattern(regexp = "(0[1-9]|1[0-2])/\\d{2}", message = "cardExpiry must be MM/YY") String cardExpiry) {
}
