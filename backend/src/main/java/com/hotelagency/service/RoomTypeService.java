package com.hotelagency.service;

import com.hotelagency.dto.room.RoomImageRequest;
import com.hotelagency.dto.room.RoomImageResponse;
import com.hotelagency.dto.room.RoomTypeRequest;
import com.hotelagency.dto.room.RoomTypeResponse;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.RoomImage;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoomImageRepository;
import com.hotelagency.repository.RoomTypeRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final RoomImageRepository roomImageRepository;
    private final HotelService hotelService;

    @Transactional
    public RoomTypeResponse create(Long hotelId, RoomTypeRequest request, User requester) {
        Hotel hotel = hotelService.getOwnedHotel(hotelId, requester);

        RoomType roomType = new RoomType();
        roomType.setHotel(hotel);
        applyRequest(roomType, request);
        roomTypeRepository.save(roomType);

        return RoomTypeResponse.from(roomType, List.of());
    }

    public List<RoomTypeResponse> listByHotel(Long hotelId, User requester) {
        hotelService.getViewableHotel(hotelId, requester);

        return roomTypeRepository.findByHotelId(hotelId).stream()
                .map(roomType -> RoomTypeResponse.from(roomType, images(roomType.getId())))
                .toList();
    }

    @Transactional
    public RoomTypeResponse update(Long roomTypeId, RoomTypeRequest request, User requester) {
        RoomType roomType = getOwnedRoomType(roomTypeId, requester);

        applyRequest(roomType, request);

        return RoomTypeResponse.from(roomType, images(roomType.getId()));
    }

    @Transactional
    public void delete(Long roomTypeId, User requester) {
        RoomType roomType = getOwnedRoomType(roomTypeId, requester);

        roomImageRepository.deleteAll(roomImageRepository.findByRoomTypeId(roomTypeId));
        roomTypeRepository.delete(roomType);
    }

    @Transactional
    public RoomImageResponse addImage(Long roomTypeId, RoomImageRequest request, User requester) {
        RoomType roomType = getOwnedRoomType(roomTypeId, requester);

        RoomImage image = roomImageRepository.save(new RoomImage(roomType, request.imageUrl()));
        return RoomImageResponse.from(image);
    }

    @Transactional
    public void removeImage(Long imageId, User requester) {
        RoomImage image = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Room image not found: " + imageId));
        hotelService.getOwnedHotel(image.getRoomType().getHotel().getId(), requester);

        roomImageRepository.delete(image);
    }

    /**
     * Loads a room type while enforcing hotel-admin ownership, for services that
     * manage a room type's sub-resources (prices, availability, ...).
     */
    public RoomType getOwnedRoomType(Long roomTypeId, User requester) {
        RoomType roomType = getRoomTypeOrThrow(roomTypeId);
        hotelService.getOwnedHotel(roomType.getHotel().getId(), requester);
        return roomType;
    }

    /**
     * Loads a room type while enforcing the same visibility rules as the parent hotel.
     */
    public RoomType getViewableRoomType(Long roomTypeId, User requester) {
        RoomType roomType = getRoomTypeOrThrow(roomTypeId);
        hotelService.getViewableHotel(roomType.getHotel().getId(), requester);
        return roomType;
    }

    private void applyRequest(RoomType roomType, RoomTypeRequest request) {
        roomType.setName(request.name());
        roomType.setDescription(request.description());
        roomType.setCapacity(request.capacity());
        roomType.setNumberOfRooms(request.numberOfRooms());
        roomType.setBedType(request.bedType());
        roomType.setRoomSize(request.roomSize());
    }

    private List<RoomImageResponse> images(Long roomTypeId) {
        return roomImageRepository.findByRoomTypeId(roomTypeId).stream().map(RoomImageResponse::from).toList();
    }

    private RoomType getRoomTypeOrThrow(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found: " + id));
    }
}
