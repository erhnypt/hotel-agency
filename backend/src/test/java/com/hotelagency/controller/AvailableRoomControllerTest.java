package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.reservation.AvailableRoomResponse;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.ReservationService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AvailableRoomController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class AvailableRoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ReservationService reservationService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void searchAsAgencyStaffReturns200() throws Exception {
        when(reservationService.searchAvailableRooms(any(), any(), any(), any(), any())).thenReturn(List.of(
                new AvailableRoomResponse(2L, "Deluxe Room", "Spacious", 3, "King Bed",
                        new BigDecimal("600.00"), "EUR")));

        mockMvc.perform(get("/api/hotels/1/available-rooms")
                        .param("checkIn", "2026-09-10")
                        .param("checkOut", "2026-09-15")
                        .param("guests", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Deluxe Room"))
                .andExpect(jsonPath("$[0].totalPrice").value(600.00));
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void searchAsHotelAdminReturns403() throws Exception {
        mockMvc.perform(get("/api/hotels/1/available-rooms")
                        .param("checkIn", "2026-09-10")
                        .param("checkOut", "2026-09-15")
                        .param("guests", "2"))
                .andExpect(status().isForbidden());
    }
}
