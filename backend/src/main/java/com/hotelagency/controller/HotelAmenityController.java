package com.hotelagency.controller;

import com.hotelagency.dto.service.ServiceRequest;
import com.hotelagency.dto.service.ServiceResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.AmenityService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels/{hotelId}/services")
@RequiredArgsConstructor
public class HotelAmenityController {

    private final AmenityService amenityService;

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> list(
            @PathVariable Long hotelId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(amenityService.listByHotel(hotelId, principal.getUser()));
    }

    @PostMapping
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ServiceResponse> create(
            @PathVariable Long hotelId,
            @Valid @RequestBody ServiceRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(amenityService.create(hotelId, request, principal.getUser()));
    }
}
