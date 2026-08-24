package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.availability.RoomAvailabilityRequest;
import com.hotelagency.dto.availability.RoomAvailabilityResponse;
import com.hotelagency.entity.RoomAvailability;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoomAvailabilityRepository;
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
class RoomAvailabilityServiceTest {

    @Mock
    private RoomAvailabilityRepository roomAvailabilityRepository;
    @Mock
    private RoomTypeService roomTypeService;

    private RoomAvailabilityService roomAvailabilityService;

    private RoomType roomType;
    private User hotelAdmin;

    @BeforeEach
    void setUp() {
        roomAvailabilityService = new RoomAvailabilityService(roomAvailabilityRepository, roomTypeService);

        Role hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);

        roomType = new RoomType();
        roomType.setId(1L);

        hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);
    }

    @Test
    void upsertCreatesNewAvailabilityWhenNoneExistsForDate() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenReturn(roomType);
        when(roomAvailabilityRepository.findByRoomTypeIdAndDate(1L, date)).thenReturn(Optional.empty());

        RoomAvailabilityResponse response = roomAvailabilityService.upsert(
                1L, new RoomAvailabilityRequest(date, 7), hotelAdmin);

        ArgumentCaptor<RoomAvailability> captor = ArgumentCaptor.forClass(RoomAvailability.class);
        verify(roomAvailabilityRepository).save(captor.capture());
        RoomAvailability saved = captor.getValue();
        assertThat(saved.getRoomType()).isEqualTo(roomType);
        assertThat(saved.getDate()).isEqualTo(date);
        assertThat(saved.getAvailableRooms()).isEqualTo(7);
        assertThat(response.availableRooms()).isEqualTo(7);
    }

    @Test
    void upsertOverwritesExistingAvailabilityForSameDate() {
        LocalDate date = LocalDate.of(2026, 9, 1);
        RoomAvailability existing = new RoomAvailability();
        existing.setId(9L);
        existing.setRoomType(roomType);
        existing.setDate(date);
        existing.setAvailableRooms(10);

        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenReturn(roomType);
        when(roomAvailabilityRepository.findByRoomTypeIdAndDate(1L, date)).thenReturn(Optional.of(existing));

        RoomAvailabilityResponse response = roomAvailabilityService.upsert(
                1L, new RoomAvailabilityRequest(date, 6), hotelAdmin);

        assertThat(response.id()).isEqualTo(9L);
        assertThat(existing.getAvailableRooms()).isEqualTo(6);
        verify(roomAvailabilityRepository).save(existing);
    }

    @Test
    void upsertPropagatesOwnershipFailure() {
        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> roomAvailabilityService.upsert(
                1L, new RoomAvailabilityRequest(LocalDate.now(), 5), hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(roomAvailabilityRepository, never()).save(any());
    }

    @Test
    void listByRoomTypeChecksVisibilityFirst() {
        RoomAvailability availability = new RoomAvailability();
        availability.setId(1L);
        availability.setRoomType(roomType);
        availability.setDate(LocalDate.of(2026, 9, 1));
        availability.setAvailableRooms(7);

        when(roomTypeService.getViewableRoomType(eq(1L), any())).thenReturn(roomType);
        when(roomAvailabilityRepository.findByRoomTypeId(1L)).thenReturn(List.of(availability));

        List<RoomAvailabilityResponse> result = roomAvailabilityService.listByRoomType(1L, hotelAdmin);

        assertThat(result).hasSize(1);
        verify(roomTypeService).getViewableRoomType(1L, hotelAdmin);
    }

    @Test
    void deleteThrowsWhenAvailabilityMissing() {
        when(roomAvailabilityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roomAvailabilityService.delete(99L, hotelAdmin))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteRejectsWhenRequesterDoesNotOwnHotel() {
        RoomAvailability availability = new RoomAvailability();
        availability.setId(5L);
        availability.setRoomType(roomType);
        when(roomAvailabilityRepository.findById(5L)).thenReturn(Optional.of(availability));
        when(roomTypeService.getOwnedRoomType(1L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> roomAvailabilityService.delete(5L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(roomAvailabilityRepository, never()).delete(any());
    }
}
