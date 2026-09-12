package com.hotelagency.dto.hotel;

import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.RoomType;
import java.math.BigDecimal;

/** A registered, active hotel that has finished setup — shown on the public landing-page search. */
public record PublicHotelResponse(
        Long id,
        String name,
        String city,
        String country,
        String description,
        BigDecimal priceFrom,
        String currency) {

    public static PublicHotelResponse from(Hotel hotel, RoomType cheapestRoomType) {
        return new PublicHotelResponse(
                hotel.getId(),
                hotel.getName(),
                hotel.getCity(),
                hotel.getCountry(),
                hotel.getDescription(),
                cheapestRoomType.getBasePrice(),
                cheapestRoomType.getCurrency());
    }
}
