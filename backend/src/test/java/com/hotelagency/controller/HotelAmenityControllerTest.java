package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.service.ServiceRequest;
import com.hotelagency.dto.service.ServiceResponse;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.AmenityService;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HotelAmenityController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class HotelAmenityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private AmenityService amenityService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private ServiceResponse sampleResponse() {
        return new ServiceResponse(
                1L, 1L, "Free Wi-Fi", "Lobby & rooms", BigDecimal.ZERO, "TRY", Instant.now(), Instant.now());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void createAsHotelAdminReturns201() throws Exception {
        when(amenityService.create(eq(1L), any(), any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/hotels/1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ServiceRequest("Free Wi-Fi", "Lobby & rooms", BigDecimal.ZERO, "TRY"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Free Wi-Fi"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void createAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(post("/api/hotels/1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ServiceRequest("Free Wi-Fi", null, BigDecimal.ZERO, "TRY"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void createRejectsBlankName() throws Exception {
        mockMvc.perform(post("/api/hotels/1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ServiceRequest("", null, BigDecimal.ZERO, "TRY"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void createRejectsNegativePrice() throws Exception {
        mockMvc.perform(post("/api/hotels/1/services")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new ServiceRequest("Spa", null, new BigDecimal("-10"), "TRY"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.price").exists());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_ADMIN)
    void listReturns200() throws Exception {
        when(amenityService.listByHotel(eq(1L), any())).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/hotels/1/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Free Wi-Fi"))
                .andExpect(jsonPath("$[0].price").value(0));
    }
}
