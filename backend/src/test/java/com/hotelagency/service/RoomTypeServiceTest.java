package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.room.RoomImageRequest;
import com.hotelagency.dto.room.RoomTypeRequest;
import com.hotelagency.dto.room.RoomTypeResponse;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.RoomImage;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoomImageRepository;
import com.hotelagency.repository.RoomTypeRepository;
import java.math.BigDecimal;
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
class RoomTypeServiceTest {

    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private RoomImageRepository roomImageRepository;
    @Mock
    private HotelService hotelService;

    private RoomTypeService roomTypeService;

    private Hotel hotel;
    private User hotelAdmin;

    @BeforeEach
    void setUp() {
        roomTypeService = new RoomTypeService(roomTypeRepository, roomImageRepository, hotelService);

        Role hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);

        hotel = new Hotel();
        hotel.setId(1L);

        hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);
    }

    private RoomTypeRequest sampleRequest() {
        return new RoomTypeRequest("Deluxe Room", "Spacious room", 3, 5, "King Bed", new BigDecimal("35.00"));
    }

    @Test
    void createSavesRoomTypeUnderOwnedHotel() {
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenReturn(hotel);

        RoomTypeResponse response = roomTypeService.create(1L, sampleRequest(), hotelAdmin);

        ArgumentCaptor<RoomType> captor = ArgumentCaptor.forClass(RoomType.class);
        verify(roomTypeRepository).save(captor.capture());
        RoomType saved = captor.getValue();
        assertThat(saved.getHotel()).isEqualTo(hotel);
        assertThat(saved.getName()).isEqualTo("Deluxe Room");
        assertThat(saved.getCapacity()).isEqualTo(3);
        assertThat(response.hotelId()).isEqualTo(1L);
    }

    @Test
    void createPropagatesOwnershipFailure() {
        when(hotelService.getOwnedHotel(2L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> roomTypeService.create(2L, sampleRequest(), hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);

        verify(roomTypeRepository, never()).save(any());
    }

    @Test
    void listByHotelChecksVisibilityThenReturnsRoomTypesWithImages() {
        RoomType roomType = new RoomType();
        roomType.setId(5L);
        roomType.setHotel(hotel);
        roomType.setName("Standard Room");
        roomType.setCapacity(2);
        roomType.setNumberOfRooms(10);
        roomType.setBedType("Double Bed");

        when(hotelService.getViewableHotel(eq(1L), any())).thenReturn(hotel);
        when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType));
        when(roomImageRepository.findByRoomTypeId(5L))
                .thenReturn(List.of(new RoomImage(roomType, "https://example.com/img.jpg")));

        List<RoomTypeResponse> result = roomTypeService.listByHotel(1L, hotelAdmin);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).images()).extracting("imageUrl").containsExactly("https://example.com/img.jpg");
        verify(hotelService).getViewableHotel(1L, hotelAdmin);
    }

    @Test
    void updateRejectsWhenRequesterDoesNotOwnHotel() {
        RoomType roomType = new RoomType();
        roomType.setId(5L);
        roomType.setHotel(hotel);
        when(roomTypeRepository.findById(5L)).thenReturn(Optional.of(roomType));
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenThrow(new AccessDeniedException("not your hotel"));

        assertThatThrownBy(() -> roomTypeService.update(5L, sampleRequest(), hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void updateThrowsWhenRoomTypeMissing() {
        when(roomTypeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> roomTypeService.update(99L, sampleRequest(), hotelAdmin))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteRemovesRoomTypeAndItsImages() {
        RoomType roomType = new RoomType();
        roomType.setId(5L);
        roomType.setHotel(hotel);
        when(roomTypeRepository.findById(5L)).thenReturn(Optional.of(roomType));
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenReturn(hotel);
        when(roomImageRepository.findByRoomTypeId(5L)).thenReturn(List.of());

        roomTypeService.delete(5L, hotelAdmin);

        verify(roomTypeRepository, times(1)).delete(roomType);
    }

    @Test
    void addImageRequiresOwnership() {
        RoomType roomType = new RoomType();
        roomType.setId(5L);
        roomType.setHotel(hotel);
        when(roomTypeRepository.findById(5L)).thenReturn(Optional.of(roomType));
        when(hotelService.getOwnedHotel(1L, hotelAdmin)).thenReturn(hotel);
        when(roomImageRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var response = roomTypeService.addImage(5L, new RoomImageRequest("https://example.com/a.jpg"), hotelAdmin);

        assertThat(response.imageUrl()).isEqualTo("https://example.com/a.jpg");
        assertThat(response.roomTypeId()).isEqualTo(5L);
    }
}
