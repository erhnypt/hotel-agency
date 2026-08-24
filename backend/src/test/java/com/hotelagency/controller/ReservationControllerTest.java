package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.customer.CustomerResponse;
import com.hotelagency.dto.reservation.ReservationResponse;
import com.hotelagency.entity.ReservationStatus;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.ReservationService;
import java.math.BigDecimal;
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

@WebMvcTest(ReservationController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservationService reservationService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private ReservationResponse sampleResponse(ReservationStatus status) {
        CustomerResponse customer = new CustomerResponse(3L, "John", "Smith", "+1 555", "john@example.com",
                null, null, null, Instant.now(), Instant.now());
        return new ReservationResponse(1L, "RES-100001", 1L, "Grand Hotel", 2L, "Deluxe Room", customer,
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, new BigDecimal("600.00"), "EUR",
                status, Instant.now(), Instant.now());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void createAsAgencyStaffReturns201() throws Exception {
        when(reservationService.create(any(), any())).thenReturn(sampleResponse(ReservationStatus.PENDING));

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hotelId\":1,\"roomTypeId\":2,\"checkIn\":\"2026-09-10\","
                                + "\"checkOut\":\"2026-09-15\",\"guests\":2,\"customerId\":3}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reservationNumber").value("RES-100001"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void createAsHotelAdminReturns403() throws Exception {
        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hotelId\":1,\"roomTypeId\":2,\"checkIn\":\"2026-09-10\","
                                + "\"checkOut\":\"2026-09-15\",\"guests\":2,\"customerId\":3}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void createRejectsMissingGuests() throws Exception {
        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"hotelId\":1,\"roomTypeId\":2,\"checkIn\":\"2026-09-10\","
                                + "\"checkOut\":\"2026-09-15\",\"customerId\":3}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.guests").exists());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_ADMIN)
    void listReturns200() throws Exception {
        when(reservationService.findAll(any())).thenReturn(List.of(sampleResponse(ReservationStatus.PENDING)));

        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].reservationNumber").value("RES-100001"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void confirmAsHotelAdminReturns200() throws Exception {
        when(reservationService.confirm(org.mockito.ArgumentMatchers.eq(1L), any()))
                .thenReturn(sampleResponse(ReservationStatus.CONFIRMED));

        mockMvc.perform(post("/api/reservations/1/confirm"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void confirmAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(post("/api/reservations/1/confirm"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void cancelAsAgencyStaffReturns200() throws Exception {
        when(reservationService.cancel(org.mockito.ArgumentMatchers.eq(1L), any()))
                .thenReturn(sampleResponse(ReservationStatus.CANCELLED));

        mockMvc.perform(post("/api/reservations/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void cancelAsHotelAdminReturns403() throws Exception {
        mockMvc.perform(post("/api/reservations/1/cancel"))
                .andExpect(status().isForbidden());
    }
}
