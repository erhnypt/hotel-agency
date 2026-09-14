package com.hotelagency.dto.reservation;

import com.hotelagency.entity.Customer;

/** Full, unmasked card details — only handed out through the explicit "show card" reveal endpoint. */
public record CardDetailsResponse(
        String customerFirstName,
        String customerLastName,
        String cardHolder,
        String cardBrand,
        String cardNumber,
        String cardExpiry,
        String cardNote) {

    public static CardDetailsResponse from(Customer customer) {
        return new CardDetailsResponse(
                customer.getFirstName(),
                customer.getLastName(),
                customer.getCardHolder(),
                customer.getCardBrand(),
                customer.getCardNumber(),
                customer.getCardExpiry(),
                customer.getCardNote());
    }
}
