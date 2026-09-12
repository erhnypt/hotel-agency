package com.hotelagency.controller;

import com.hotelagency.dto.support.SupportMessageCreateRequest;
import com.hotelagency.dto.support.SupportMessageResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.SupportMessageService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotels/{hotelId}/support-messages")
@RequiredArgsConstructor
public class SupportMessageController {

    private final SupportMessageService supportMessageService;

    @GetMapping
    public ResponseEntity<List<SupportMessageResponse>> list(
            @PathVariable Long hotelId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(supportMessageService.listByHotel(hotelId, principal.getUser()));
    }

    @PostMapping
    public ResponseEntity<SupportMessageResponse> send(
            @PathVariable Long hotelId,
            @Valid @RequestBody SupportMessageCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(supportMessageService.send(hotelId, request, principal.getUser()));
    }
}
