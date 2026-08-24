package com.hotelagency.controller;

import com.hotelagency.dto.reservation.AvailableRoomResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.ReservationService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels/{hotelId}/available-rooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('AGENCY_STAFF')")
public class AvailableRoomController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<AvailableRoomResponse>> search(
            @PathVariable Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam Integer guests,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(
                reservationService.searchAvailableRooms(hotelId, checkIn, checkOut, guests, principal.getUser()));
    }
}
