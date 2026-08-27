package com.hotelagency.controller;

import com.hotelagency.dto.price.RoomPriceRequest;
import com.hotelagency.dto.price.RoomPriceResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.RoomPriceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms/{roomTypeId}/price")
@RequiredArgsConstructor
public class RoomPriceController {

    private final RoomPriceService roomPriceService;

    @GetMapping
    public ResponseEntity<RoomPriceResponse> get(
            @PathVariable Long roomTypeId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(roomPriceService.get(roomTypeId, principal.getUser()));
    }

    @PutMapping
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<RoomPriceResponse> set(
            @PathVariable Long roomTypeId,
            @Valid @RequestBody RoomPriceRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(roomPriceService.set(roomTypeId, request, principal.getUser()));
    }
}
