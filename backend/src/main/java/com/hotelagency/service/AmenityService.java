package com.hotelagency.service;

import com.hotelagency.dto.service.ServiceRequest;
import com.hotelagency.dto.service.ServiceResponse;
import com.hotelagency.entity.Amenity;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.AmenityRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;
    private final HotelService hotelService;

    @Transactional
    public ServiceResponse create(Long hotelId, ServiceRequest request, User requester) {
        Hotel hotel = hotelService.getOwnedHotel(hotelId, requester);

        Amenity amenity = new Amenity();
        amenity.setHotel(hotel);
        amenity.setName(request.name());
        amenity.setDescription(request.description());
        amenityRepository.save(amenity);

        return ServiceResponse.from(amenity);
    }

    public List<ServiceResponse> listByHotel(Long hotelId, User requester) {
        hotelService.getViewableHotel(hotelId, requester);

        return amenityRepository.findByHotelId(hotelId).stream().map(ServiceResponse::from).toList();
    }

    @Transactional
    public void delete(Long serviceId, User requester) {
        Amenity amenity = amenityRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));
        hotelService.getOwnedHotel(amenity.getHotel().getId(), requester);

        amenityRepository.delete(amenity);
    }
}
