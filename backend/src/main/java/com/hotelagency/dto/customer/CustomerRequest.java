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
        // Card on file (school project). The API never receives or stores a CVV.
        @Size(max = 255) String cardHolder,
        @Size(max = 20) String cardBrand,
        @Pattern(regexp = "\\d{12,19}", message = "cardNumber must be 12-19 digits") String cardNumber,
        @Pattern(regexp = "(0[1-9]|1[0-2])/\\d{2}", message = "cardExpiry must be MM/YY") String cardExpiry,
        @Size(max = 255) String cardNote,
        @Size(max = 255) String cardNote2) {
}
