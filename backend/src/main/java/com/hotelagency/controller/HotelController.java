package com.hotelagency.controller;

import com.hotelagency.dto.hotel.HotelRegisterRequest;
import com.hotelagency.dto.hotel.HotelRegisterResponse;
import com.hotelagency.dto.hotel.HotelResponse;
import com.hotelagency.dto.hotel.HotelUpdateRequest;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.HotelService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService hotelService;

    @PostMapping
    public ResponseEntity<HotelRegisterResponse> register(@Valid @RequestBody HotelRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelService.register(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENCY_ADMIN', 'AGENCY_STAFF')")
    public ResponseEntity<List<HotelResponse>> findAll(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(hotelService.findAll(principal.getUser()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<HotelResponse> findMine(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(hotelService.findMine(principal.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelResponse> findById(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(hotelService.findById(id, principal.getUser()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<HotelResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody HotelUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(hotelService.update(id, request, principal.getUser()));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('AGENCY_ADMIN')")
    public ResponseEntity<HotelResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.approve(id));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('AGENCY_ADMIN')")
    public ResponseEntity<HotelResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(hotelService.reject(id));
    }
}
