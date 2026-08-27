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
import com.hotelagency.dto.room.RoomTypeRequest;
import com.hotelagency.dto.room.RoomTypeResponse;
import com.hotelagency.entity.RoleName;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.RoomTypeService;
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

@WebMvcTest(RoomTypeController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class RoomTypeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private RoomTypeService roomTypeService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private RoomTypeRequest sampleRequest() {
        return new RoomTypeRequest("Deluxe Room", "Spacious room", 3, 5, "King Bed", new BigDecimal("35.00"));
    }

    private RoomTypeResponse sampleResponse() {
        return new RoomTypeResponse(1L, 1L, "Deluxe Room", "Spacious room", 3, 5, "King Bed",
                new BigDecimal("35.00"), new BigDecimal("120.00"), "EUR", List.of(), Instant.now(), Instant.now());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void createAsHotelAdminReturns201() throws Exception {
        when(roomTypeService.create(eq(1L), any(), any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/hotels/1/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Deluxe Room"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void createAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(post("/api/hotels/1/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void createRejectsInvalidCapacity() throws Exception {
        RoomTypeRequest invalid = new RoomTypeRequest("Deluxe Room", "desc", 0, 5, "King Bed", null);

        mockMvc.perform(post("/api/hotels/1/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.capacity").exists());
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_ADMIN)
    void listReturns200() throws Exception {
        when(roomTypeService.listByHotel(eq(1L), any())).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/hotels/1/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Deluxe Room"));
    }
}
