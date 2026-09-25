package com.hotelagency.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.UserSummary;
import com.hotelagency.dto.hotel.HotelNotesResponse;
import com.hotelagency.dto.hotel.HotelNotesUpdateRequest;
import com.hotelagency.dto.hotel.HotelRegisterRequest;
import com.hotelagency.dto.hotel.HotelRegisterResponse;
import com.hotelagency.dto.hotel.HotelResponse;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.entity.RoleName;
import com.hotelagency.config.SecurityConfig;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.security.WithMockCustomUser;
import com.hotelagency.service.HotelService;
import com.hotelagency.service.SupportMessageService;
import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HotelController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class HotelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private HotelService hotelService;

    @MockitoBean
    private SupportMessageService supportMessageService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    private HotelRegisterRequest sampleRequest() {
        return new HotelRegisterRequest(
                "Grand Hotel", "grand@example.com", "password123", "+90 555 000",
                "Main St 1", "Istanbul", "Turkey", "A nice hotel", "Jane Doe");
    }

    private HotelResponse sampleHotelResponse(HotelStatus status) {
        return new HotelResponse(1L, "Grand Hotel", "grand@example.com", "+90 555 000",
                "Main St 1", "Istanbul", "Turkey", "A nice hotel", "Jane Doe", null,
                status, Instant.now(), Instant.now());
    }

    @Test
    void registerReturns201() throws Exception {
        UserSummary userSummary = new UserSummary(1L, "grand@example.com", "Jane Doe", RoleName.HOTEL_ADMIN);
        AuthResponse auth = new AuthResponse("access-token", "refresh-token", 3_600_000L, userSummary);
        HotelRegisterResponse response = new HotelRegisterResponse(sampleHotelResponse(HotelStatus.PENDING), auth);
        when(hotelService.register(any())).thenReturn(response);

        mockMvc.perform(post("/api/hotels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.hotel.status").value("PENDING"))
                .andExpect(jsonPath("$.auth.accessToken").value("access-token"));
    }

    @Test
    void registerRejectsBlankName() throws Exception {
        HotelRegisterRequest request = new HotelRegisterRequest(
                "", "grand@example.com", "password123", "+90 555 000",
                "Main St 1", "Istanbul", "Turkey", "A nice hotel", "Jane Doe");

        mockMvc.perform(post("/api/hotels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.name").exists());
    }

    @Test
    @WithMockUser(roles = "AGENCY_ADMIN")
    void approveAsAgencyAdminReturns200() throws Exception {
        when(hotelService.approve(eq(1L))).thenReturn(sampleHotelResponse(HotelStatus.ACTIVE));

        mockMvc.perform(post("/api/hotels/1/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(roles = "AGENCY_STAFF")
    void approveAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(post("/api/hotels/1/approve"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void findMineAsHotelAdminReturns200() throws Exception {
        when(hotelService.findMine(any())).thenReturn(sampleHotelResponse(HotelStatus.ACTIVE));

        mockMvc.perform(get("/api/hotels/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Grand Hotel"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.AGENCY_STAFF)
    void findMineAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(get("/api/hotels/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENCY_ADMIN")
    void deactivateAsAgencyAdminReturns200() throws Exception {
        when(hotelService.deactivate(eq(1L))).thenReturn(sampleHotelResponse(HotelStatus.INACTIVE));

        mockMvc.perform(post("/api/hotels/1/deactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("INACTIVE"));
    }

    @Test
    @WithMockUser(roles = "AGENCY_STAFF")
    void deactivateAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(post("/api/hotels/1/deactivate"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENCY_ADMIN")
    void reactivateAsAgencyAdminReturns200() throws Exception {
        when(hotelService.reactivate(eq(1L))).thenReturn(sampleHotelResponse(HotelStatus.ACTIVE));

        mockMvc.perform(post("/api/hotels/1/reactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(roles = "AGENCY_ADMIN")
    void deleteAsAgencyAdminReturns204() throws Exception {
        mockMvc.perform(delete("/api/hotels/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "AGENCY_STAFF")
    void deleteAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(delete("/api/hotels/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENCY_ADMIN")
    void getNotesAsAgencyAdminReturns200() throws Exception {
        when(hotelService.getNotes(eq(1L)))
                .thenReturn(new HotelNotesResponse(1L, "Kasım ayında fiyat pazarlığı yapıldı", Instant.now()));

        mockMvc.perform(get("/api/hotels/1/notes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hotelId").value(1))
                .andExpect(jsonPath("$.adminNotes").value("Kasım ayında fiyat pazarlığı yapıldı"));
    }

    @Test
    @WithMockUser(roles = "AGENCY_ADMIN")
    void updateNotesAsAgencyAdminReturns200() throws Exception {
        when(hotelService.updateNotes(eq(1L), any(HotelNotesUpdateRequest.class)))
                .thenReturn(new HotelNotesResponse(1L, "Yeni not", Instant.now()));

        mockMvc.perform(put("/api/hotels/1/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new HotelNotesUpdateRequest("Yeni not"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.adminNotes").value("Yeni not"));
    }

    @Test
    @WithMockCustomUser(role = RoleName.HOTEL_ADMIN)
    void getNotesAsHotelAdminReturns403() throws Exception {
        mockMvc.perform(get("/api/hotels/1/notes"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AGENCY_STAFF")
    void updateNotesAsAgencyStaffReturns403() throws Exception {
        mockMvc.perform(put("/api/hotels/1/notes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"adminNotes\":\"deneme\"}"))
                .andExpect(status().isForbidden());
    }
}
