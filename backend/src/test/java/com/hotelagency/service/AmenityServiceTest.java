package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.service.ServiceRequest;
import com.hotelagency.dto.service.ServiceResponse;
import com.hotelagency.entity.Amenity;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.AmenityRepository;
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
class AmenityServiceTest {

    @Mock
    private AmenityRepository amenityRepository;
    @Mock
    private HotelService hotelService;

    private AmenityService amenityService;

    private Hotel hotel;
    private User hotelAdmin;

    @BeforeEach
    void setUp() {
        amenityService = new AmenityService(amenityRepository, hotelService);

        Role hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);

        hotel = new Hotel();
        hotel.setId(1L);

        hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);
    }

    @Test
    void createSavesServiceUnderOwnedHotel() {
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenReturn(hotel);

        ServiceResponse response = amenityService.create(1L, new ServiceRequest("Free Wi-Fi", "Lobby & rooms"), hotelAdmin);

        ArgumentCaptor<Amenity> captor = ArgumentCaptor.forClass(Amenity.class);
        verify(amenityRepository).save(captor.capture());
        Amenity saved = captor.getValue();
        assertThat(saved.getHotel()).isEqualTo(hotel);
        assertThat(saved.getName()).isEqualTo("Free Wi-Fi");
        assertThat(response.hotelId()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Free Wi-Fi");
    }

    @Test
    void createPropagatesOwnershipFailure() {
        when(hotelService.getOwnedHotel(2L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> amenityService.create(2L, new ServiceRequest("Spa", null), hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(amenityRepository, never()).save(any());
    }

    @Test
    void listByHotelChecksVisibilityFirst() {
        Amenity amenity = new Amenity();
        amenity.setId(5L);
        amenity.setHotel(hotel);
        amenity.setName("Breakfast");

        when(hotelService.getViewableHotel(eq(1L), any())).thenReturn(hotel);
        when(amenityRepository.findByHotelId(1L)).thenReturn(List.of(amenity));

        List<ServiceResponse> result = amenityService.listByHotel(1L, hotelAdmin);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("Breakfast");
        verify(hotelService).getViewableHotel(1L, hotelAdmin);
    }

    @Test
    void deleteRemovesServiceWhenOwned() {
        Amenity amenity = new Amenity();
        amenity.setId(5L);
        amenity.setHotel(hotel);
        when(amenityRepository.findById(5L)).thenReturn(Optional.of(amenity));
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenReturn(hotel);

        amenityService.delete(5L, hotelAdmin);

        verify(amenityRepository).delete(amenity);
    }

    @Test
    void deleteThrowsWhenServiceMissing() {
        when(amenityRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> amenityService.delete(99L, hotelAdmin))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteRejectsWhenRequesterDoesNotOwnHotel() {
        Amenity amenity = new Amenity();
        amenity.setId(5L);
        amenity.setHotel(hotel);
        when(amenityRepository.findById(5L)).thenReturn(Optional.of(amenity));
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> amenityService.delete(5L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(amenityRepository, never()).delete(any());
    }
}
