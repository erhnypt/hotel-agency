package com.hotelagency.controller;

import com.hotelagency.dto.hotel.HotelSetupReminderLogResponse;
import com.hotelagency.service.HotelService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
}
