package com.hotelagency.controller;

import com.hotelagency.dto.availability.RoomAvailabilityRequest;
import com.hotelagency.dto.availability.RoomAvailabilityResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.RoomAvailabilityService;
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
@RequestMapping("/api/rooms/{roomTypeId}/availability")
@RequiredArgsConstructor
public class RoomAvailabilityController {

    private final RoomAvailabilityService roomAvailabilityService;

    @GetMapping
    public ResponseEntity<List<RoomAvailabilityResponse>> list(
            @PathVariable Long roomTypeId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(roomAvailabilityService.listByRoomType(roomTypeId, principal.getUser()));
    }

    @PostMapping
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<RoomAvailabilityResponse> upsert(
            @PathVariable Long roomTypeId,
            @Valid @RequestBody RoomAvailabilityRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomAvailabilityService.upsert(roomTypeId, request, principal.getUser()));
    }
}
