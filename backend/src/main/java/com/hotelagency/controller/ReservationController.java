package com.hotelagency.controller;

import com.hotelagency.dto.reservation.ReservationCreateRequest;
import com.hotelagency.dto.reservation.ReservationResponse;
import com.hotelagency.security.CustomUserDetails;
import com.hotelagency.service.ReservationService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> findAll(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.findAll(principal.getUser()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AGENCY_STAFF', 'AGENCY_ADMIN')")
    public ResponseEntity<ReservationResponse> create(
            @Valid @RequestBody ReservationCreateRequest request, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationService.create(request, principal.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> findById(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.findById(id, principal.getUser()));
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ReservationResponse> confirm(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.confirm(id, principal.getUser()));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ReservationResponse> reject(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.reject(id, principal.getUser()));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('AGENCY_STAFF', 'AGENCY_ADMIN')")
    public ResponseEntity<ReservationResponse> cancel(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.cancel(id, principal.getUser()));
    }

    @PostMapping("/{id}/mark-paid")
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ReservationResponse> markPaid(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.markPaid(id, principal.getUser()));
    }

    @PostMapping("/{id}/unmark-paid")
    @PreAuthorize("hasRole('HOTEL_ADMIN')")
    public ResponseEntity<ReservationResponse> unmarkPaid(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(reservationService.unmarkPaid(id, principal.getUser()));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> invoice(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        ReservationService.InvoiceFile invoice = reservationService.generateInvoice(id, principal.getUser());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + invoice.filename() + "\"")
                .body(invoice.bytes());
    }
}
