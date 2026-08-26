package com.hotelagency.dto.service;

import com.hotelagency.entity.Amenity;
import java.math.BigDecimal;
import java.time.Instant;

public record ServiceResponse(
        Long id,
        Long hotelId,
        String name,
        String description,
        BigDecimal price,
        String currency,
        Instant createdAt,
        Instant updatedAt) {

    public static ServiceResponse from(Amenity amenity) {
        return new ServiceResponse(
                amenity.getId(),
                amenity.getHotel().getId(),
                amenity.getName(),
                amenity.getDescription(),
                amenity.getPrice(),
                amenity.getCurrency(),
                amenity.getCreatedAt(),
                amenity.getUpdatedAt());
    }
}
