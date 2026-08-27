package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.bookingrequest.BookingRequestResponse;
import com.hotelagency.entity.BookingRequestStatus;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.BookingRequestService;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BookingRequestController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class BookingRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private BookingRequestService bookingRequestService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private BookingRequestResponse sampleResponse() {
        return new BookingRequestResponse(
                1L, "n123", "Grand Lisboa Hotel", "Hotel", "Lizbon", "PT", "Portekiz",
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 13), 2,
                "Jane Doe", "jane@example.com", "+351 555 111", null,
                BookingRequestStatus.NEW, Instant.now(), Instant.now());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_ADMIN)
    void listReturns200ForAgencyAdmin() throws Exception {
        when(bookingRequestService.findAll()).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/booking-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].propertyName").value("Grand Lisboa Hotel"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void listForbiddenForHotelAdmin() throws Exception {
        mockMvc.perform(get("/api/booking-requests"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void updateStatusReturns200ForAgencyStaff() throws Exception {
        BookingRequestResponse updated = new BookingRequestResponse(
                1L, "n123", "Grand Lisboa Hotel", "Hotel", "Lizbon", "PT", "Portekiz",
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 13), 2,
                "Jane Doe", "jane@example.com", "+351 555 111", null,
                BookingRequestStatus.IN_PROGRESS, Instant.now(), Instant.now());
        when(bookingRequestService.updateStatus(eq(1L), eq(BookingRequestStatus.IN_PROGRESS))).thenReturn(updated);

        mockMvc.perform(post("/api/booking-requests/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(java.util.Map.of("status", "IN_PROGRESS"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }
}
