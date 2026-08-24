package com.hotelagency.controller;

import com.hotelagency.dto.room.RoomTypeRequest;
import com.hotelagency.dto.room.RoomTypeResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.RoomTypeService;
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
@RequestMapping("/api/hotels/{hotelId}/rooms")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public ResponseEntity<List<RoomTypeResponse>> list(
            @PathVariable Long hotelId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(roomTypeService.listByHotel(hotelId, principal.getUser()));
    }

    @PostMapping
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<RoomTypeResponse> create(
            @PathVariable Long hotelId,
            @Valid @RequestBody RoomTypeRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomTypeService.create(hotelId, request, principal.getUser()));
    }
}
