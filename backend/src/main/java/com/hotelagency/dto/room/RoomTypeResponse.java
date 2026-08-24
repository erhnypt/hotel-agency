package com.hotelagency.dto.room;

import com.hotelagency.entity.RoomType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record RoomTypeResponse(
        Long id,
        Long hotelId,
        String name,
        String description,
        Integer capacity,
        Integer numberOfRooms,
        String bedType,
        BigDecimal roomSize,
        List<RoomImageResponse> images,
        Instant createdAt,
        Instant updatedAt) {

    public static RoomTypeResponse from(RoomType roomType, List<RoomImageResponse> images) {
        return new RoomTypeResponse(
                roomType.getId(),
                roomType.getHotel().getId(),
                roomType.getName(),
                roomType.getDescription(),
                roomType.getCapacity(),
                roomType.getNumberOfRooms(),
                roomType.getBedType(),
                roomType.getRoomSize(),
                images,
                roomType.getCreatedAt(),
                roomType.getUpdatedAt());
    }
}
