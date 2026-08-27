package com.hotelagency.service;

import com.hotelagency.dto.bookingrequest.BookingRequestCreateRequest;
import com.hotelagency.dto.bookingrequest.BookingRequestResponse;
import com.hotelagency.entity.BookingRequest;
import com.hotelagency.entity.BookingRequestStatus;
import com.hotelagency.exception.InvalidReservationException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.BookingRequestRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingRequestService {

    private final BookingRequestRepository bookingRequestRepository;

    @Transactional
    public BookingRequestResponse create(BookingRequestCreateRequest request) {
        if (!request.checkOut().isAfter(request.checkIn())) {
            throw new InvalidReservationException("Check-out date must be after check-in date");
        }

        BookingRequest entity = new BookingRequest();
        entity.setPropertyId(request.propertyId());
        entity.setPropertyName(request.propertyName());
        entity.setHotelType(request.hotelType());
        entity.setPropertyCity(blankToNull(request.propertyCity()));
        entity.setCountryCode(blankToNull(request.countryCode()));
        entity.setCountryName(blankToNull(request.countryName()));
        entity.setCheckIn(request.checkIn());
        entity.setCheckOut(request.checkOut());
        entity.setGuests(request.guests());
        entity.setContactName(request.contactName().trim());
        entity.setContactEmail(request.contactEmail().trim());
        entity.setContactPhone(request.contactPhone().trim());
        entity.setMessage(blankToNull(request.message()));
        entity.setStatus(BookingRequestStatus.NEW);

        bookingRequestRepository.save(entity);
        return BookingRequestResponse.from(entity);
    }

    @Transactional(readOnly = true)
    public List<BookingRequestResponse> findAll() {
        return bookingRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(BookingRequestResponse::from)
                .toList();
    }

    @Transactional
    public BookingRequestResponse updateStatus(Long id, BookingRequestStatus status) {
        BookingRequest entity = bookingRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking request not found: " + id));
        entity.setStatus(status);
        return BookingRequestResponse.from(entity);
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
