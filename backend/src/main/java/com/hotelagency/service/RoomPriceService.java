package com.hotelagency.service;

import com.hotelagency.dto.price.RoomPriceRequest;
import com.hotelagency.dto.price.RoomPriceResponse;
import com.hotelagency.entity.RoomPrice;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoomPriceRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomPriceService {

    private final RoomPriceRepository roomPriceRepository;
    private final RoomTypeService roomTypeService;

    @Transactional
    public RoomPriceResponse upsert(Long roomTypeId, RoomPriceRequest request, User requester) {
        RoomType roomType = roomTypeService.getOwnedRoomType(roomTypeId, requester);

        RoomPrice price = roomPriceRepository.findByRoomTypeIdAndDate(roomTypeId, request.date())
                .orElseGet(() -> {
                    RoomPrice created = new RoomPrice();
                    created.setRoomType(roomType);
                    created.setDate(request.date());
                    return created;
                });
        price.setPrice(request.price());
        price.setCurrency(request.currency());
        roomPriceRepository.save(price);

        return RoomPriceResponse.from(price);
    }

    public List<RoomPriceResponse> listByRoomType(Long roomTypeId, User requester) {
        roomTypeService.getViewableRoomType(roomTypeId, requester);

        return roomPriceRepository.findByRoomTypeId(roomTypeId).stream().map(RoomPriceResponse::from).toList();
    }

    @Transactional
    public void delete(Long id, User requester) {
        RoomPrice price = roomPriceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room price not found: " + id));
        roomTypeService.getOwnedRoomType(price.getRoomType().getId(), requester);

        roomPriceRepository.delete(price);
    }
}
