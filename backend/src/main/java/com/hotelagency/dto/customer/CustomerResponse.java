package com.hotelagency.dto.customer;

import com.hotelagency.entity.Customer;
import java.time.Instant;

public record CustomerResponse(
        Long id,
        String firstName,
        String lastName,
        String phone,
        String email,
        String passportNumber,
        String nationality,
        String notes,
        String cardHolder,
        String cardBrand,
        String cardNumber,
        String cardExpiry,
        String cardNote,
        Instant createdAt,
        Instant updatedAt) {

    public static CustomerResponse from(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getPassportNumber(),
                customer.getNationality(),
                customer.getNotes(),
                customer.getCardHolder(),
                customer.getCardBrand(),
                customer.getCardNumber(),
                customer.getCardExpiry(),
                customer.getCardNote(),
                customer.getCreatedAt(),
                customer.getUpdatedAt());
    }

    /** Same as {@link #from} but with card number/expiry/CVV masked — used when a reservation is sent to a hotel. */
    public static CustomerResponse masked(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getPhone(),
                customer.getEmail(),
                customer.getPassportNumber(),
                customer.getNationality(),
                customer.getNotes(),
                customer.getCardHolder(),
                customer.getCardBrand(),
                maskCardNumber(customer.getCardNumber()),
                customer.getCardExpiry() != null ? "••/••" : null,
                customer.getCardNote() != null ? "•••" : null,
                customer.getCreatedAt(),
                customer.getUpdatedAt());
    }

    private static String maskCardNumber(String number) {
        if (number == null || number.isBlank()) {
            return null;
        }
        String digits = number.replaceAll("\\D", "");
        if (digits.length() < 4) {
            return "••••";
        }
        return "•••• •••• •••• " + digits.substring(digits.length() - 4);
    }
}
