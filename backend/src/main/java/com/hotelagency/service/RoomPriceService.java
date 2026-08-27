package com.hotelagency.service;

import com.hotelagency.dto.price.RoomPriceRequest;
import com.hotelagency.dto.price.RoomPriceResponse;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Manages a room type's single nightly base price. A room type has one price;
 * availability is derived from reservations, so there is nothing per-date here.
 */
@Service
@RequiredArgsConstructor
public class RoomPriceService {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomTypeService roomTypeService;

    public RoomPriceResponse get(Long roomTypeId, User requester) {
        return RoomPriceResponse.from(roomTypeService.getViewableRoomType(roomTypeId, requester));
    }

    @Transactional
    public RoomPriceResponse set(Long roomTypeId, RoomPriceRequest request, User requester) {
        RoomType roomType = roomTypeService.getOwnedRoomType(roomTypeId, requester);
        roomType.setBasePrice(request.price());
        roomType.setCurrency(request.currency());
        roomTypeRepository.save(roomType);
        return RoomPriceResponse.from(roomType);
    }
}
