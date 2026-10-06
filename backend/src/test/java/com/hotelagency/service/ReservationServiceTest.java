package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.customer.CustomerRequest;
import com.hotelagency.dto.reservation.ReservedRoomRequest;
import com.hotelagency.entity.Amenity;
import com.hotelagency.dto.reservation.AvailableRoomResponse;
import com.hotelagency.dto.reservation.ReservationCreateRequest;
import com.hotelagency.dto.reservation.ReservationResponse;
import com.hotelagency.entity.Customer;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.ReservationStatus;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.InvalidReservationException;
import com.hotelagency.repository.AmenityRepository;
import com.hotelagency.repository.CustomerRepository;
import com.hotelagency.repository.ReservationRepository;
import com.hotelagency.repository.ReservedRoomRepository;
import com.hotelagency.repository.ReservedServiceRepository;
import com.hotelagency.repository.ReservationStatusHistoryRepository;
import com.hotelagency.repository.RoomTypeRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    private ReservedRoomRepository reservedRoomRepository;
    @Mock
    private ReservedServiceRepository reservedServiceRepository;
    @Mock
    private ReservationStatusHistoryRepository historyRepository;
    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private CustomerService customerService;
    @Mock
    private HotelService hotelService;
    @Mock
    private InvoiceService invoiceService;
    @Mock
    private EmailService emailService;
    @Mock
    private CardViewLogService cardViewLogService;
    @Mock
    private AmenityRepository amenityRepository;

    private ReservationService reservationService;

    private Hotel hotel;
    private RoomType roomType;
    private Customer customer;
    private User staff;
    private User hotelAdmin;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(
                reservationRepository, reservedRoomRepository, reservedServiceRepository, amenityRepository,
                historyRepository, roomTypeRepository, customerRepository, customerService, hotelService,
                invoiceService, emailService, cardViewLogService);

        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.ACTIVE);

        roomType = new RoomType();
        roomType.setId(2L);
        roomType.setHotel(hotel);
        roomType.setName("Deluxe Room");
        roomType.setCapacity(2);
        roomType.setNumberOfRooms(5);
        roomType.setBedType("King Bed");
        roomType.setBasePrice(new BigDecimal("120.00"));
        roomType.setCurrency("EUR");

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
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, 3L, null, null, null);
    }

    private void stubBookable() {
        hotel.setStatus(HotelStatus.ACTIVE);
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        when(reservationRepository.sumBookedQuantitiesByRoomType(any(), any(), any(), any())).thenReturn(List.of());
        when(reservedRoomRepository.sumBookedQuantities(any(), any(), any(), any())).thenReturn(List.of());
        when(reservationRepository.save(any())).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            if (r.getId() == null) {
                r.setId(99L);
            }
            return r;
        });
    }

    @Test
    void createRejectsWhenHotelIsNotActive() {
        hotel.setStatus(HotelStatus.INACTIVE);
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void searchAvailableRoomsRejectsWhenHotelIsNotActive() {
        hotel.setStatus(HotelStatus.PENDING);
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        LocalDate date = LocalDate.of(2026, 9, 10);

        assertThatThrownBy(() -> reservationService.searchAvailableRooms(1L, date, date.plusDays(1), 2, staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(roomTypeRepository, never()).findByHotelId(any());
    }

    @Test
    void createCalculatesTotalPriceFromNightlyRate() {
        stubBookable();
        when(customerRepository.findById(3L)).thenReturn(Optional.of(customer));

        ReservationResponse response = reservationService.create(sampleRequest(), staff);

        assertThat(response.totalPrice()).isEqualByComparingTo("600.00");
        assertThat(response.currency()).isEqualTo("EUR");
        assertThat(response.status()).isEqualTo(ReservationStatus.PENDING);
        assertThat(response.reservationNumber()).isEqualTo("RES-100099");
    }

    @Test
    void createUsesNewCustomerWhenNoCustomerIdProvided() {
        stubBookable();
        CustomerRequest newCustomer = new CustomerRequest("Jane", "Doe", "+1 555", null, null, null, null, null, null, null, null, null);
        when(customerService.createEntity(newCustomer)).thenReturn(customer);

        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, null, newCustomer, null, null);

        reservationService.create(request, staff);

        verify(customerService).createEntity(newCustomer);
        verify(customerRepository, never()).findById(any());
    }

    @Test
    void createRejectsWhenCheckOutNotAfterCheckIn() {
        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 15), LocalDate.of(2026, 9, 15), 2, 3L, null, null, null);

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
    void createRejectsWhenAllRoomsOfThatTypeAreBooked() {
        roomType.setNumberOfRooms(1);
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        when(reservationRepository.sumBookedQuantitiesByRoomType(any(), any(), any(), any()))
                .thenReturn(List.<Object[]>of(new Object[] { 2L, 1L }));

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createRejectsWhenRequestedQuantityExceedsAvailability() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        when(reservationRepository.sumBookedQuantitiesByRoomType(any(), any(), any(), any())).thenReturn(List.of());
        when(reservedRoomRepository.sumBookedQuantities(any(), any(), any(), any())).thenReturn(List.of());
        // 5 rooms exist, so requesting 6 must be rejected.
        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2,
                3L, null, List.of(new ReservedRoomRequest(2L, 6)), null);

        assertThatThrownBy(() -> reservationService.create(request, staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createRejectsWhenNightlyPriceNotSet() {
        roomType.setBasePrice(null);
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));

        assertThatThrownBy(() -> reservationService.create(sampleRequest(), staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createBooksMultipleRoomTypesWithQuantities() {
        stubBookable();
        RoomType standard = new RoomType();
        standard.setId(6L);
        standard.setHotel(hotel);
        standard.setName("Standard");
        standard.setCapacity(2);
        standard.setNumberOfRooms(4);
        standard.setBasePrice(new BigDecimal("80.00"));
        standard.setCurrency("EUR");
        when(roomTypeRepository.findById(6L)).thenReturn(Optional.of(standard));
        when(customerRepository.findById(3L)).thenReturn(Optional.of(customer));

        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 12), 4,
                3L, null, List.of(new ReservedRoomRequest(2L, 1), new ReservedRoomRequest(6L, 2)), null);

        ReservationResponse response = reservationService.create(request, staff);

        // Deluxe 120 x1 + Standard 80 x2 = 280 per night x 2 nights = 560
        assertThat(response.totalPrice()).isEqualByComparingTo("560.00");
        assertThat(response.rooms()).hasSize(2);
        assertThat(response.rooms().get(1).name()).isEqualTo("Standard");
        assertThat(response.rooms().get(1).quantity()).isEqualTo(2);
        assertThat(response.rooms().get(1).lineTotal()).isEqualByComparingTo("320.00");
    }

    @Test
    void createBooksServicesAndAddsTheirPriceToTotal() {
        stubBookable();
        Amenity service = new Amenity();
        service.setId(7L);
        service.setHotel(hotel);
        service.setName("Airport Transfer");
        service.setPrice(new BigDecimal("40.00"));
        service.setCurrency("EUR");
        when(amenityRepository.findAllById(any())).thenReturn(List.of(service));
        when(customerRepository.findById(3L)).thenReturn(Optional.of(customer));

        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, 3L, null, null, List.of(7L));

        ReservationResponse response = reservationService.create(request, staff);

        assertThat(response.totalPrice()).isEqualByComparingTo("640.00");
        assertThat(response.services()).hasSize(1);
        assertThat(response.services().get(0).name()).isEqualTo("Airport Transfer");
        assertThat(response.services().get(0).unitPrice()).isEqualByComparingTo("40.00");
    }

    @Test
    void createRejectsServiceFromAnotherHotel() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        Hotel otherHotel = new Hotel();
        otherHotel.setId(50L);
        Amenity foreignService = new Amenity();
        foreignService.setId(8L);
        foreignService.setHotel(otherHotel);
        foreignService.setName("Foreign Service");
        foreignService.setPrice(new BigDecimal("10.00"));
        foreignService.setCurrency("EUR");
        when(amenityRepository.findAllById(any())).thenReturn(List.of(foreignService));

        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, 3L, null, null, List.of(8L));

        assertThatThrownBy(() -> reservationService.create(request, staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    void createRejectsServiceWithMismatchedCurrency() {
        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findById(2L)).thenReturn(Optional.of(roomType));
        Amenity dollarService = new Amenity();
        dollarService.setId(9L);
        dollarService.setHotel(hotel);
        dollarService.setName("Spa");
        dollarService.setPrice(new BigDecimal("25.00"));
        dollarService.setCurrency("USD");
        when(amenityRepository.findAllById(any())).thenReturn(List.of(dollarService));

        ReservationCreateRequest request = new ReservationCreateRequest(
                1L, 2L, LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 15), 2, 3L, null, null, List.of(9L));

        assertThatThrownBy(() -> reservationService.create(request, staff))
                .isInstanceOf(InvalidReservationException.class);

        verify(reservationRepository, never()).save(any());
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

    private Reservation openReservation() {
        Reservation reservation = fullReservation();
        reservation.setCheckOut(LocalDate.now().plusDays(3));
        customer.setCardNumber("4242424242424242");
        customer.setCardExpiry("12/29");
        customer.setCardNote("123");
        return reservation;
    }

    private void hotelOwnsReservation(Reservation reservation) {
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);
    }

    @Test
    void revealCardWorksWhileReservationIsOpen() {
        Reservation reservation = openReservation();
        hotelOwnsReservation(reservation);

        assertThat(reservationService.revealCard(1L, hotelAdmin).cardNumber()).isEqualTo("4242424242424242");
        verify(cardViewLogService).record(reservation, hotelAdmin);
    }

    @Test
    void revealCardIsDeniedWhenAdminSwitchedItOff() {
        Reservation reservation = openReservation();
        reservation.setCardVisibleToHotel(false);
        hotelOwnsReservation(reservation);

        assertThatThrownBy(() -> reservationService.revealCard(1L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
        verify(cardViewLogService, never()).record(any(), any());
    }

    @Test
    void revealCardIsDeniedOnceReservationIsPaidCancelledOrRejected() {
        for (ReservationStatus closed : List.of(ReservationStatus.CANCELLED, ReservationStatus.REJECTED)) {
            Reservation reservation = openReservation();
            reservation.setStatus(closed);
            hotelOwnsReservation(reservation);
            assertThatThrownBy(() -> reservationService.revealCard(1L, hotelAdmin))
                    .isInstanceOf(AccessDeniedException.class);
        }

        Reservation paid = openReservation();
        paid.setStatus(ReservationStatus.CONFIRMED);
        paid.setPaid(true);
        hotelOwnsReservation(paid);
        assertThatThrownBy(() -> reservationService.revealCard(1L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void revealCardIsDeniedAfterCheckOut() {
        Reservation reservation = openReservation();
        reservation.setCheckOut(LocalDate.now().minusDays(1));
        hotelOwnsReservation(reservation);

        assertThatThrownBy(() -> reservationService.revealCard(1L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void hotelListHidesCardEntirelyWhenAccessIsOff() {
        Reservation reservation = openReservation();
        reservation.setCardVisibleToHotel(false);
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);
        when(reservationRepository.findByHotelId(1L)).thenReturn(List.of(reservation));

        ReservationResponse response = reservationService.findAll(hotelAdmin).get(0);

        assertThat(response.cardAvailableToHotel()).isFalse();
        assertThat(response.customer().cardNumber()).isNull();
        assertThat(response.customer().cardNote()).isNull();
    }

    @Test
    void setCardVisibleToHotelFlipsTheSwitch() {
        Reservation reservation = openReservation();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThat(reservationService.setCardVisibleToHotel(1L, false).cardVisibleToHotel()).isFalse();
        assertThat(reservationService.setCardVisibleToHotel(1L, true).cardAvailableToHotel()).isTrue();
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
    void rejectTransitionsPendingToRejected() {
        Reservation reservation = fullReservation();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(hotelService.requireOwnHotelId(hotelAdmin)).thenReturn(1L);

        ReservationResponse response = reservationService.reject(1L, hotelAdmin);

        assertThat(response.status()).isEqualTo(ReservationStatus.REJECTED);
        verify(historyRepository).save(any());
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
    void cancelFromConfirmedRecordsHistory() {
        Reservation reservation = fullReservation();
        reservation.setStatus(ReservationStatus.CONFIRMED);
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        ReservationResponse response = reservationService.cancel(1L, staff);

        assertThat(response.status()).isEqualTo(ReservationStatus.CANCELLED);
        verify(historyRepository).save(any());
    }

    @Test
    void searchAvailableRoomsFiltersByCapacityAndQuotesNightlyRate() {
        RoomType tooSmall = new RoomType();
        tooSmall.setId(5L);
        tooSmall.setHotel(hotel);
        tooSmall.setCapacity(1);
        tooSmall.setNumberOfRooms(3);
        tooSmall.setBasePrice(new BigDecimal("80.00"));
        tooSmall.setCurrency("EUR");

        roomType.setBasePrice(new BigDecimal("150.00"));

        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType, tooSmall));
        when(reservationRepository.sumBookedQuantitiesByRoomType(any(), any(), any(), any())).thenReturn(List.of());
        when(reservedRoomRepository.sumBookedQuantities(any(), any(), any(), any())).thenReturn(List.of());
        LocalDate date = LocalDate.of(2026, 9, 10);

        List<AvailableRoomResponse> result = reservationService.searchAvailableRooms(
                1L, date, date.plusDays(1), 2, staff);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).roomTypeId()).isEqualTo(2L);
        assertThat(result.get(0).totalPrice()).isEqualByComparingTo("150.00");
    }

    @Test
    void searchAvailableRoomsSkipsRoomTypesWithoutAPrice() {
        roomType.setBasePrice(null);

        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType));
        when(reservationRepository.sumBookedQuantitiesByRoomType(any(), any(), any(), any())).thenReturn(List.of());
        when(reservedRoomRepository.sumBookedQuantities(any(), any(), any(), any())).thenReturn(List.of());
        LocalDate date = LocalDate.of(2026, 9, 10);

        List<AvailableRoomResponse> result = reservationService.searchAvailableRooms(
                1L, date, date.plusDays(1), 2, staff);

        assertThat(result).isEmpty();
    }

    @Test
    void searchAvailableRoomsExcludesFullyBookedRoomTypes() {
        roomType.setNumberOfRooms(2);

        when(hotelService.getViewableHotel(1L, staff)).thenReturn(hotel);
        when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType));
        when(reservationRepository.sumBookedQuantitiesByRoomType(any(), any(), any(), any()))
                .thenReturn(List.<Object[]>of(new Object[] { 2L, 2L }));
        when(reservedRoomRepository.sumBookedQuantities(any(), any(), any(), any())).thenReturn(List.of());
        LocalDate date = LocalDate.of(2026, 9, 10);

        List<AvailableRoomResponse> result = reservationService.searchAvailableRooms(
                1L, date, date.plusDays(1), 2, staff);

        assertThat(result).isEmpty();
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
