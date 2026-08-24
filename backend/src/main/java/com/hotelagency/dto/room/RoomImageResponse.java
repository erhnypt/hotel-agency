package com.hotelagency.dto.room;

import com.hotelagency.entity.RoomImage;

public record RoomImageResponse(Long id, Long roomTypeId, String imageUrl) {

    public static RoomImageResponse from(RoomImage image) {
        return new RoomImageResponse(image.getId(), image.getRoomType().getId(), image.getImageUrl());
    }
}
