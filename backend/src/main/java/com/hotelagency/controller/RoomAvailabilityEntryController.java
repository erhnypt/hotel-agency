package com.hotelagency.controller;

import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.RoomAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/room-availability")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HOTEL_ADMIN')")
public class RoomAvailabilityEntryController {

    private final RoomAvailabilityService roomAvailabilityService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        roomAvailabilityService.delete(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
