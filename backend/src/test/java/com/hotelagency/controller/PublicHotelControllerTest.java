package com.hotelagency.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.hotelagency.config.SecurityConfig;
import com.hotelagency.dto.hotel.PublicHotelResponse;
import com.hotelagency.dto.room.RoomTypeResponse;
import com.hotelagency.security.CustomUserDetailsService;
import com.hotelagency.security.JwtAuthenticationFilter;
import com.hotelagency.security.JwtService;
import com.hotelagency.security.RestAuthenticationEntryPoint;
import com.hotelagency.service.HotelService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PublicHotelController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, RestAuthenticationEntryPoint.class})
@AutoConfigureMockMvc(addFilters = false)
class PublicHotelControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HotelService hotelService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService userDetailsService;

    @Test
    void listReturnsPublicCatalogWithoutAuthentication() throws Exception {
        when(hotelService.listPublicCatalog()).thenReturn(List.of(
                new PublicHotelResponse(2L, "Grand Hotel", "Istanbul", "Turkey", "A nice hotel",
                        new BigDecimal("50.00"), "EUR")));

        mockMvc.perform(get("/api/public/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Grand Hotel"))
                .andExpect(jsonPath("$[0].currency").value("EUR"));
    }

    @Test
    void listRoomsReturnsRoomTypesWithoutAuthentication() throws Exception {
        when(hotelService.listPublicRoomTypes(2L)).thenReturn(List.of(
                new RoomTypeResponse(4L, 2L, "3 KİŞİLİK", "desc", 3, 15, "Queen", new BigDecimal("28.0"),
                        new BigDecimal("300.00"), "EUR", List.of(), null, null)));

        mockMvc.perform(get("/api/public/hotels/2/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("3 KİŞİLİK"))
                .andExpect(jsonPath("$[0].basePrice").value(300.00));
    }
}
