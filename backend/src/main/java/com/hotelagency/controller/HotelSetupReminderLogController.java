package com.hotelagency.controller;

import com.hotelagency.dto.hotel.HotelSetupReminderLogResponse;
import com.hotelagency.dto.hotel.IncompleteHotelSetupResponse;
import com.hotelagency.service.HotelService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/hotel-setup-reminder-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('AGENCY_ADMIN')")
public class HotelSetupReminderLogController {

    private final HotelService hotelService;

    @GetMapping
    public List<HotelSetupReminderLogResponse> recent() {
        return hotelService.listSetupReminderLogs();
    }

    @GetMapping("/incomplete-hotels")
    public List<IncompleteHotelSetupResponse> incompleteHotels() {
        return hotelService.listIncompleteHotels();
    }

    @PostMapping("/incomplete-hotels/{hotelId}/send")
    public ResponseEntity<Void> sendManualReminder(@PathVariable Long hotelId) {
        hotelService.sendManualSetupReminder(hotelId);
        return ResponseEntity.ok().build();
    }
}
