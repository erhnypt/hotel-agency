package com.hotelagency.dto.hotel;

import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelStatus;
import java.time.Instant;

public record HotelResponse(
        Long id,
        String name,
        String email,
        String phone,
        String address,
        String city,
        String country,
        String description,
        String contactPerson,
        String website,
        HotelStatus status,
        Instant createdAt,
        Instant updatedAt) {

    public static HotelResponse from(Hotel hotel) {
        return new HotelResponse(
                hotel.getId(),
                hotel.getName(),
                hotel.getEmail(),
                hotel.getPhone(),
                hotel.getAddress(),
                hotel.getCity(),
                hotel.getCountry(),
                hotel.getDescription(),
                hotel.getContactPerson(),
                hotel.getWebsite(),
                hotel.getStatus(),
                hotel.getCreatedAt(),
                hotel.getUpdatedAt());
    }
}
