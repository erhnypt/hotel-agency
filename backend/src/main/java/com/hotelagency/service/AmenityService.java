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
        applyRequest(amenity, request);
        amenityRepository.save(amenity);

        return ServiceResponse.from(amenity);
    }

    public List<ServiceResponse> listByHotel(Long hotelId, User requester) {
        hotelService.getViewableHotel(hotelId, requester);

        return amenityRepository.findByHotelId(hotelId).stream().map(ServiceResponse::from).toList();
    }

    @Transactional
    public ServiceResponse update(Long serviceId, ServiceRequest request, User requester) {
        Amenity amenity = getOwnedAmenity(serviceId, requester);

        applyRequest(amenity, request);

        return ServiceResponse.from(amenity);
    }

    @Transactional
    public void delete(Long serviceId, User requester) {
        Amenity amenity = getOwnedAmenity(serviceId, requester);

        amenityRepository.delete(amenity);
    }

    private Amenity getOwnedAmenity(Long serviceId, User requester) {
        Amenity amenity = amenityRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + serviceId));
        hotelService.getOwnedHotel(amenity.getHotel().getId(), requester);
        return amenity;
    }

    private void applyRequest(Amenity amenity, ServiceRequest request) {
        amenity.setName(request.name());
        amenity.setDescription(request.description());
        amenity.setPrice(request.price());
        amenity.setCurrency(request.currency());
    }
}
