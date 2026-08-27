package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.bookingrequest.BookingRequestResponse;
import com.hotelagency.entity.BookingRequestStatus;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.service.BookingRequestService;
import java.time.Instant;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PublicBookingRequestController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class PublicBookingRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookingRequestService bookingRequestService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private static String json(String contactEmail) {
        return """
                {
                  "propertyId": "city-hotel",
                  "propertyName": "Cassidy City Hotel",
                  "hotelType": "City",
                  "countryCode": "PRT",
                  "countryName": "Portugal",
                  "checkIn": "2026-09-10",
                  "checkOut": "2026-09-13",
                  "guests": 2,
                  "contactName": "Jane Doe",
                  "contactEmail": "%s",
                  "contactPhone": "+351 555 111"
                }
                """.formatted(contactEmail);
    }

    private BookingRequestResponse sampleResponse() {
        return new BookingRequestResponse(
                1L, "n123", "Grand Lisboa Hotel", "Hotel", "Lizbon", "PT", "Portekiz",
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 13), 2,
                "Jane Doe", "jane@example.com", "+351 555 111", null,
                BookingRequestStatus.NEW, Instant.now(), Instant.now());
    }

    @Test
    void createReturns201WithoutAuthentication() throws Exception {
        when(bookingRequestService.create(any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/public/booking-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("jane@example.com")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.propertyName").value("Grand Lisboa Hotel"))
                .andExpect(jsonPath("$.status").value("NEW"));
    }

    @Test
    void createRejectsInvalidEmail() throws Exception {
        mockMvc.perform(post("/api/public/booking-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("not-an-email")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.contactEmail").exists());
    }
}
