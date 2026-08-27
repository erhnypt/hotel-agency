package com.hotelagency.controller;

import com.hotelagency.dto.bookingrequest.BookingRequestCreateRequest;
import com.hotelagency.dto.bookingrequest.BookingRequestResponse;
import com.hotelagency.service.BookingRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Unauthenticated: the landing-page hotel search submits enquiries here. */
@RestController
@RequestMapping("/api/public/booking-requests")
@RequiredArgsConstructor
public class PublicBookingRequestController {

    private final BookingRequestService bookingRequestService;

    @PostMapping
    public ResponseEntity<BookingRequestResponse> create(@Valid @RequestBody BookingRequestCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingRequestService.create(request));
    }
}
