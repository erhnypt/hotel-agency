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
                customer.getCreatedAt(),
                customer.getUpdatedAt());
    }
}
