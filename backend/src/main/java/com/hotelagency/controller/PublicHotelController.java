package com.hotelagency.controller;

import com.hotelagency.dto.hotel.PublicHotelResponse;
import com.hotelagency.service.HotelService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Unauthenticated: powers the landing-page hotel search with real, bookable hotels. */
@RestController
@RequestMapping("/api/public/hotels")
@RequiredArgsConstructor
public class PublicHotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<PublicHotelResponse>> list() {
        return ResponseEntity.ok(hotelService.listPublicCatalog());
    }
}
