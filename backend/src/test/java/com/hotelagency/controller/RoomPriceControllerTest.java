package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.price.RoomPriceResponse;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.RoomPriceService;
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

@WebMvcTest(RoomPriceController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class RoomPriceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RoomPriceService roomPriceService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private RoomPriceResponse sampleResponse() {
        return new RoomPriceResponse(1L, 1L, LocalDate.of(2026, 9, 1), new BigDecimal("120.00"), "EUR", Instant.now());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void upsertAsHotelAdminReturns201() throws Exception {
        when(roomPriceService.upsert(eq(1L), any(), any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/rooms/1/prices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"date\":\"2026-09-01\",\"price\":120.00,\"currency\":\"EUR\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.price").value(120.00))
                .andExpect(jsonPath("$.currency").value("EUR"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void upsertAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(post("/api/rooms/1/prices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"date\":\"2026-09-01\",\"price\":120.00,\"currency\":\"EUR\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void upsertRejectsNegativePrice() throws Exception {
        mockMvc.perform(post("/api/rooms/1/prices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"date\":\"2026-09-01\",\"price\":-10.00,\"currency\":\"EUR\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.price").exists());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_ADMIN)
    void listReturns200() throws Exception {
        when(roomPriceService.listByRoomType(eq(1L), any())).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/rooms/1/prices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].currency").value("EUR"));
    }
}
