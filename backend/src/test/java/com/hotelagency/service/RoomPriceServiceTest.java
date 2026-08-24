package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.price.RoomPriceRequest;
import com.hotelagency.dto.price.RoomPriceResponse;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.RoomPrice;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoomPriceRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class RoomPriceServiceTest {

    @Mock
    private RoomPriceRepository roomPriceRepository;
    @Mock
    private RoomTypeService roomTypeService;

    private RoomPriceService roomPriceService;

    private RoomType roomType;
    private User hotelAdmin;

    @BeforeEach
    void setUp() {
        roomPriceService = new RoomPriceService(roomPriceRepository, roomTypeService);

        Role hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);

        roomType = new RoomType();
        roomType.setId(1L);

        hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);
    }

    @Test
    void upsertCreatesNewPriceWhenNoneExistsForDate() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        RoomPriceRequest request = new RoomPriceRequest(date, new BigDecimal("120.00"), "EUR");

        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenReturn(roomType);
        when(roomPriceRepository.findByRoomTypeIdAndDate(1L, date)).thenReturn(Optional.empty());

        RoomPriceResponse response = roomPriceService.upsert(1L, request, hotelAdmin);

        ArgumentCaptor<RoomPrice> captor = ArgumentCaptor.forClass(RoomPrice.class);
        verify(roomPriceRepository).save(captor.capture());
        RoomPrice saved = captor.getValue();
        assertThat(saved.getRoomType()).isEqualTo(roomType);
        assertThat(saved.getDate()).isEqualTo(date);
        assertThat(saved.getPrice()).isEqualByComparingTo("120.00");
        assertThat(response.currency()).isEqualTo("EUR");
    }

    @Test
    void upsertOverwritesExistingPriceForSameDate() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        RoomPrice existing = new RoomPrice();
        existing.setId(7L);
        existing.setRoomType(roomType);
        existing.setDate(date);
        existing.setPrice(new BigDecimal("100.00"));
        existing.setCurrency("EUR");

        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenReturn(roomType);
        when(roomPriceRepository.findByRoomTypeIdAndDate(1L, date)).thenReturn(Optional.of(existing));

        RoomPriceResponse response = roomPriceService.upsert(
                1L, new RoomPriceRequest(date, new BigDecimal("130.00"), "EUR"), hotelAdmin);

        assertThat(response.id()).isEqualTo(7L);
        assertThat(existing.getPrice()).isEqualByComparingTo("130.00");
        verify(roomPriceRepository).save(existing);
    }

    @Test
    void upsertPropagatesOwnershipFailure() {
        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> roomPriceService.upsert(
                1L, new RoomPriceRequest(LocalDate.now(), BigDecimal.TEN, "EUR"), hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(roomPriceRepository, never()).save(any());
    }

    @Test
    void listByRoomTypeChecksVisibilityFirst() {
        RoomPrice price = new RoomPrice();
        price.setId(1L);
        price.setRoomType(roomType);
        price.setDate(LocalDate.of(2026, 9, 1));
        price.setPrice(new BigDecimal("120.00"));
        price.setCurrency("EUR");

        when(roomTypeService.getViewableRoomType(eq(1L), any())).thenReturn(roomType);
        when(roomPriceRepository.findByRoomTypeId(1L)).thenReturn(List.of(price));

        List<RoomPriceResponse> result = roomPriceService.listByRoomType(1L, hotelAdmin);

        assertThat(result).hasSize(1);
        verify(roomTypeService).getViewableRoomType(1L, hotelAdmin);
    }

    @Test
    void deleteThrowsWhenPriceMissing() {
        when(roomPriceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roomPriceService.delete(99L, hotelAdmin))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteRejectsWhenRequesterDoesNotOwnHotel() {
        RoomPrice price = new RoomPrice();
        price.setId(5L);
        price.setRoomType(roomType);
        when(roomPriceRepository.findById(5L)).thenReturn(Optional.of(price));
        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> roomPriceService.delete(5L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(roomPriceRepository, never()).delete(any());
    }
}
