package com.hotelagency.controller;

import com.hotelagency.dto.room.RoomImageRequest;
import com.hotelagency.dto.room.RoomImageResponse;
import com.hotelagency.dto.room.RoomTypeRequest;
import com.hotelagency.dto.room.RoomTypeResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('HOTEL_ADMIN')")
public class RoomController {

    private final RoomTypeService roomTypeService;

    @PutMapping("/{id}")
    public ResponseEntity<RoomTypeResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RoomTypeRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(roomTypeService.update(id, request, principal.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        roomTypeService.delete(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<RoomImageResponse> addImage(
            @PathVariable Long id,
            @Valid @RequestBody RoomImageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomTypeService.addImage(id, request, principal.getUser()));
    }
}
