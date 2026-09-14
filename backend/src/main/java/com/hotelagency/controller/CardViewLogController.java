package com.hotelagency.controller;

import com.hotelagency.dto.reservation.CardViewLogResponse;
import com.hotelagency.service.CardViewLogService;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/card-view-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('AGENCY_ADMIN')")
public class CardViewLogController {

    private final CardViewLogService cardViewLogService;

    @GetMapping
    public List<CardViewLogResponse> recent() {
        return cardViewLogService.listRecent();
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount() {
        return Map.of("unread", cardViewLogService.countUnread());
    }

    @PostMapping("/mark-read")
    public ResponseEntity<Void> markRead() {
        cardViewLogService.markAllRead();
        return ResponseEntity.ok().build();
    }
}
