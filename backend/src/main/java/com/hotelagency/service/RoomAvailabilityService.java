package com.hotelagency.service;

import com.hotelagency.dto.availability.RoomAvailabilityRequest;
import com.hotelagency.dto.availability.RoomAvailabilityResponse;
import com.hotelagency.entity.RoomAvailability;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoomAvailabilityRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomAvailabilityService {

    private final RoomAvailabilityRepository roomAvailabilityRepository;
    private final RoomTypeService roomTypeService;

    @Transactional
    public RoomAvailabilityResponse upsert(Long roomTypeId, RoomAvailabilityRequest request, User requester) {
        RoomType roomType = roomTypeService.getOwnedRoomType(roomTypeId, requester);

        RoomAvailability availability = roomAvailabilityRepository.findByRoomTypeIdAndDate(roomTypeId, request.date())
                .orElseGet(() -> {
                    RoomAvailability created = new RoomAvailability();
                    created.setRoomType(roomType);
                    created.setDate(request.date());
                    return created;
                });
        availability.setAvailableRooms(request.availableRooms());
        roomAvailabilityRepository.save(availability);

        return RoomAvailabilityResponse.from(availability);
    }

    public List<RoomAvailabilityResponse> listByRoomType(Long roomTypeId, User requester) {
        roomTypeService.getViewableRoomType(roomTypeId, requester);

        return roomAvailabilityRepository.findByRoomTypeId(roomTypeId).stream()
                .map(RoomAvailabilityResponse::from)
                .toList();
    }

    @Transactional
    public void delete(Long id, User requester) {
        RoomAvailability availability = roomAvailabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room availability not found: " + id));
        roomTypeService.getOwnedRoomType(availability.getRoomType().getId(), requester);

        roomAvailabilityRepository.delete(availability);
    }
}
