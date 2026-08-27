package com.hotelagency.controller;

import com.hotelagency.dto.bookingrequest.BookingRequestResponse;
import com.hotelagency.dto.bookingrequest.BookingRequestStatusUpdateRequest;
import com.hotelagency.service.BookingRequestService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/booking-requests")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('AGENCY_ADMIN', 'AGENCY_STAFF')")
public class BookingRequestController {

    private final BookingRequestService bookingRequestService;

    @GetMapping
    public ResponseEntity<List<BookingRequestResponse>> findAll() {
        return ResponseEntity.ok(bookingRequestService.findAll());
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<BookingRequestResponse> updateStatus(
            @PathVariable Long id, @Valid @RequestBody BookingRequestStatusUpdateRequest request) {
        return ResponseEntity.ok(bookingRequestService.updateStatus(id, request.status()));
    }
}
