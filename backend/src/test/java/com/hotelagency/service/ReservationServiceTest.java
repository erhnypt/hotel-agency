package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.customer.CustomerRequest;
import com.hotelagency.dto.reservation.AvailableRoomResponse;
import com.hotelagency.dto.reservation.ReservationCreateRequest;
import com.hotelagency.dto.reservation.ReservationResponse;
import com.hotelagency.entity.Customer;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.ReservationStatus;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.RoomAvailability;
import com.hotelagency.entity.RoomPrice;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.InvalidReservationException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.CustomerRepository;
import com.hotelagency.repository.ReservationRepository;
import com.hotelagency.repository.ReservationStatusHistoryRepository;
import com.hotelagency.repository.RoomAvailabilityRepository;
import com.hotelagency.repository.RoomPriceRepository;
import com.hotelagency.repository.RoomTypeRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private ReservationStatusHistoryRepository historyRepository;
    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private RoomPriceRepository roomPriceRepository;
    @Mock
    private RoomAvailabilityRepository roomAvailabilityRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private CustomerService customerService;
    @Mock
    private HotelService hotelService;

    private ReservationService reservationService;

    private Hotel hotel;
    private RoomType roomType;
    private Customer customer;
    private User staff;
    private User hotelAdmin;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(
                reservationRepository, historyRepository, roomTypeRepository, roomPriceRepository,
                roomAvailabilityRepository, customerRepository, customerService, hotelService);

        hotel = new Hotel();
        hotel.setId(1L);

        roomType = new RoomType();
        roomType.setId(2L);
        roomType.setHotel(hotel);
        roomType.setName("Deluxe Room");
        roomType.setCapacity(2);
        roomType.setBedType("King Bed");

        customer = new Customer();
        customer.setId(3L);
        customer.setFirstName("John");
        customer.setLastName("Smith");

        Role staffRole = new Role(RoleName.AGENCY_STAFF);
        staffRole.setId(2L);
        staff = new User();
        staff.setId(20L);
        staff.setRole(staffRole);

        Role hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);
        hotelAdmin = new User();
        hotelAdmin.setId(30L);
        hotelAdmin.setRole(hotelAdminRole);
    }

    private ReservationCreateRequest sampleRequest() {
        return new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, 3L, null);
    }

    private void stubPrice(LocalDate date, String price, String currency) {
        RoomPrice roomPrice = new RoomPrice();
        roomPrice.setPrice(new BigDecimal(price));
        roomPrice.setCurrency(currency);
        when(roomPriceRepository.findByRoomTypeIdAndDate(2L, date)).thenReturn(Optional.of(roomPrice));
    }

    private void stubAvailability(LocalDate date, int available) {
        RoomAvailability availability = new RoomAvailability();
        availability.setAvailableRooms(available);
        when(roomAvailabilityRepository.findByRoomTypeIdAndDate(2L, date)).thenReturn(Optional.of(availability));
    }

    private void stubFullyBookable() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        for (LocalDate date : List.of(
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 11), LocalDate.of(2026, 9, 12),
                LocalDate.of(2026, 9, 13), LocalDate.of(2026, 9, 14))) {
            stubAvailability(date, 5);
            stubPrice(date, "120.00", "EUR");
        }
        when(customerRepository.findById(3L)).thenReturn(Optional.of(customer));
        when(reservationRepository.save(any())).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            if (r.getId() == null) {
                r.setId(99L);
            }
            return r;
        });
    }

    @Test
    void createCalculatesTotalPriceFromDailyRates() {
        stubFullyBookable();

        ReservationResponse response = reservationService.create(sampleRequest(), staff);

        assertThat(response.totalPrice()).isEqualByComparingTo("600.00");
        assertThat(response.currency()).isEqualTo("EUR");
        assertThat(response.status()).isEqualTo(ReservationStatus.PENDING);
        assertThat(response.reservationNumber()).isEqualTo("RES-100099");
    }

    @Test
    void createDecrementsAvailabilityForEachNight() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        List<RoomAvailability> availabilities = new ArrayList<>();
        for (LocalDate date : List.of(
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 11), LocalDate.of(2026, 9, 12),
                LocalDate.of(2026, 9, 13), LocalDate.of(2026, 9, 14))) {
            RoomAvailability availability = new RoomAvailability();
            availability.setAvailableRooms(5);
            when(roomAvailabilityRepository.findByRoomTypeIdAndDate(2L, date)).thenReturn(Optional.of(availability));
            availabilities.add(availability);
            stubPrice(date, "120.00", "EUR");
        }
        when(customerRepository.findById(3L)).thenReturn(Optional.of(customer));
        when(reservationRepository.save(any())).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            if (r.getId() == null) {
                r.setId(99L);
            }
            return r;
        });

        reservationService.create(sampleRequest(), staff);

        assertThat(availabilities).allSatisfy(a -> assertThat(a.getAvailableRooms()).isEqualTo(4));
    }

    @Test
    void createUsesNewCustomerWhenNoCustomerIdProvided() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        for (LocalDate date : List.of(
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 11), LocalDate.of(2026, 9, 12),
                LocalDate.of(2026, 9, 13), LocalDate.of(2026, 9, 14))) {
            stubAvailability(date, 5);
            stubPrice(date, "120.00", "EUR");
        }
        CustomerRequest newCustomer = new CustomerRequest("Jane", "Doe", "+1 555", null, null, null, null);
        when(customerService.createEntity(newCustomer)).thenReturn(customer);
        when(reservationRepository.save(any())).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            if (r.getId() == null) {
                r.setId(99L);
            }
            return r;
        });

        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, null, newCustomer);

        reservationService.create(request, staff);

        verify(customerService).createEntity(newCustomer);
        verify(customerRepository, never()).findById(any());
    }

    @Test
    void createRejectsWhenCheckOutNotAfterCheckIn() {
        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 15), LocalDate.of(2026, 9, 15), 2, 3L, null);

        assertThatThrownBy(() -> reservationService.create(request, staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createRejectsWhenRoomTypeBelongsToAnotherHotel() {
        Hotel otherHotel = new Hotel();
        otherHotel.setId(99L);
        roomType.setHotel(otherHotel);

        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class);
    }

    @Test
    void createRejectsWhenCapacityInsufficient() {
        roomType.setCapacity(1);
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class);
    }

    @Test
    void createRejectsWhenRoomNotAvailableOnSomeDate() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        stubAvailability(LocalDate.of(2026, 9, 10), 5);
        stubAvailability(LocalDate.of(2026, 9, 11), 0);

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class)
                .hasMessageContaining("2026-09-11");
    }

    @Test
    void createRejectsWhenPriceMissingForSomeDate() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        for (LocalDate date : List.of(
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 11), LocalDate.of(2026, 9, 12),
                LocalDate.of(2026, 9, 13), LocalDate.of(2026, 9, 14))) {
            stubAvailability(date, 5);
        }
        stubPrice(LocalDate.of(2026, 9, 10), "120.00", "EUR");
        // no price stubbed for the remaining dates

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class);
    }

    @Test
    void findAllForAgencyAdminReturnsEverything() {
        Role adminRole = new Role(RoleName.AGENCY_ADMIN);
        adminRole.setId(1L);
        User admin = new User();
        admin.setId(1L);
        admin.setRole(adminRole);

        when(reservationRepository.findAll()).thenReturn(List.of(fullReservation()));

        List<ReservationResponse> result = reservationService.findAll(admin);

        assertThat(result).hasSize(1);
        verify(reservationRepository).findAll();
    }

    @Test
    void findAllForAgencyStaffReturnsOnlyOwnReservations() {
        when(reservationRepository.findByCreatedById(20L)).thenReturn(List.of(fullReservation()));

        List<ReservationResponse> result = reservationService.findAll(staff);

        assertThat(result).hasSize(1);
        verify(reservationRepository).findByCreatedById(20L);
    }

    @Test
    void findAllForHotelAdminReturnsOnlyOwnHotel() {
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);
        when(reservationRepository.findByHotelId(1L)).thenReturn(List.of(fullReservation()));

        List<ReservationResponse> result = reservationService.findAll(hotelAdmin);

        assertThat(result).hasSize(1);
        verify(reservationRepository).findByHotelId(1L);
    }

    @Test
    void findByIdRejectsStaffViewingSomeoneElsesReservation() {
        Reservation reservation = fullReservation();
        User otherStaff = new User();
        otherStaff.setId(999L);
        otherStaff.setRole(staff.getRole());
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.findById(1L, otherStaff))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void findByIdRejectsHotelAdminForAnotherHotel() {
        Reservation reservation = fullReservation();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(999L);

        assertThatThrownBy(() -> reservationService.findById(1L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void confirmTransitionsPendingToConfirmed() {
        Reservation reservation = fullReservation();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);

        ReservationResponse response = reservationService.confirm(1L, hotelAdmin);

        assertThat(response.status()).isEqualTo(ReservationStatus.CONFIRMED);
        verify(historyRepository).save(any());
    }

    @Test
    void confirmRejectsWhenNotPending() {
        Reservation reservation = fullReservation();
        reservation.setStatus(ReservationStatus.CONFIRMED);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);

        assertThatThrownBy(() -> reservationService.confirm(1L, hotelAdmin))
                .isInstanceOf(InvalidReservationException.class);
    }

    @Test
    void rejectRestoresAvailability() {
        Reservation reservation = fullReservation();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);
        List<RoomAvailability> availabilities = stubDistinctAvailabilityForStay(reservation, 4);

        ReservationResponse response = reservationService.reject(1L, hotelAdmin);

        assertThat(response.status()).isEqualTo(ReservationStatus.REJECTED);
        assertThat(availabilities).allSatisfy(a -> assertThat(a.getAvailableRooms()).isEqualTo(5));
    }

    @Test
    void cancelRejectsWhenNotCreator() {
        Reservation reservation = fullReservation();
        User otherStaff = new User();
        otherStaff.setId(999L);
        otherStaff.setRole(staff.getRole());
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.cancel(1L, otherStaff))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void cancelRejectsWhenAlreadyRejected() {
        Reservation reservation = fullReservation();
        reservation.setStatus(ReservationStatus.REJECTED);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.cancel(1L, staff))
                .isInstanceOf(InvalidReservationException.class);
    }

    @Test
    void cancelFromConfirmedRestoresAvailabilityAndRecordsHistory() {
        Reservation reservation = fullReservation();
        reservation.setStatus(ReservationStatus.CONFIRMED);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        List<RoomAvailability> availabilities = stubDistinctAvailabilityForStay(reservation, 4);

        ReservationResponse response = reservationService.cancel(1L, staff);

        assertThat(response.status()).isEqualTo(ReservationStatus.CANCELLED);
        assertThat(availabilities).allSatisfy(a -> assertThat(a.getAvailableRooms()).isEqualTo(5));
        verify(historyRepository).save(any());
    }

    private List<RoomAvailability> stubDistinctAvailabilityForStay(Reservation reservation, int startingCount) {
        List<RoomAvailability> availabilities = new ArrayList<>();
        for (LocalDate date = reservation.getCheckIn(); date.isBefore(reservation.getCheckOut()); date = date.plusDays(1)) {
            RoomAvailability availability = new RoomAvailability();
            availability.setAvailableRooms(startingCount);
            when(roomAvailabilityRepository.findByRoomTypeIdAndDate(reservation.getRoomType().getId(), date))
                    .thenReturn(Optional.of(availability));
            availabilities.add(availability);
        }
        return availabilities;
    }

    @Test
    void searchAvailableRoomsFiltersByCapacityAvailabilityAndPrice() {
        RoomType tooSmall = new RoomType();
        tooSmall.setId(5L);
        tooSmall.setHotel(hotel);
        tooSmall.setCapacity(1);

        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType, tooSmall));
        LocalDate date = LocalDate.of(2026, 9, 10);
        stubAvailability(date, 3);
        stubPrice(date, "150.00", "EUR");

        List<AvailableRoomResponse> result = reservationService.searchAvailableRooms(
                1L, date, date.plusDays(1), 2, staff);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).roomTypeId()).isEqualTo(2L);
        assertThat(result.get(0).totalPrice()).isEqualByComparingTo("150.00");
    }

    private Reservation fullReservation() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setReservationNumber("RES-100001");
        reservation.setHotel(hotel);
        reservation.setRoomType(roomType);
        reservation.setCustomer(customer);
        reservation.setCreatedBy(staff);
        reservation.setCheckIn(LocalDate.of(2026, 9, 10));
        reservation.setCheckOut(LocalDate.of(2026, 9, 15));
        reservation.setGuests(2);
        reservation.setTotalPrice(new BigDecimal("600.00"));
        reservation.setCurrency("EUR");
        reservation.setStatus(ReservationStatus.PENDING);
        return reservation;
    }
}
