package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.hotel.HotelRegisterRequest;
import com.hotelagency.dto.hotel.HotelRegisterResponse;
import com.hotelagency.dto.hotel.HotelUpdateRequest;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.entity.HotelUser;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.exception.DuplicateResourceException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.AmenityRepository;
import com.hotelagency.repository.HotelRepository;
import com.hotelagency.repository.HotelSetupReminderLogRepository;
import com.hotelagency.repository.HotelUserRepository;
import com.hotelagency.repository.PasswordResetTokenRepository;
import com.hotelagency.repository.ReservationRepository;
import com.hotelagency.repository.RoleRepository;
import com.hotelagency.repository.RoomImageRepository;
import com.hotelagency.repository.RoomTypeRepository;
import com.hotelagency.repository.SupportMessageRepository;
import com.hotelagency.repository.UserRepository;
import com.hotelagency.security.JwtService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private HotelUserRepository hotelUserRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private EmailService emailService;
    @Mock
    private HotelSetupReminderLogRepository hotelSetupReminderLogRepository;
    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private RoomImageRepository roomImageRepository;
    @Mock
    private AmenityRepository amenityRepository;
    @Mock
    private SupportMessageRepository supportMessageRepository;
    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    private HotelService hotelService;

    private Role hotelAdminRole;
    private Role agencyAdminRole;
    private Role agencyStaffRole;

    @BeforeEach
    void setUp() {
        JwtService jwtService = new JwtService("test-secret-key-for-jwt-signing-must-be-long-enough", 3_600_000L, 604_800_000L);
        hotelService = new HotelService(
                hotelRepository, hotelUserRepository, userRepository, roleRepository,
                passwordEncoder, jwtService, emailService, hotelSetupReminderLogRepository, roomTypeRepository,
                roomImageRepository, amenityRepository, supportMessageRepository, reservationRepository,
                passwordResetTokenRepository);

        hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);
        agencyAdminRole = new Role(RoleName.AGENCY_ADMIN);
        agencyAdminRole.setId(1L);
        agencyStaffRole = new Role(RoleName.AGENCY_STAFF);
        agencyStaffRole.setId(2L);
    }

    private HotelRegisterRequest sampleRequest() {
        return new HotelRegisterRequest(
                "Grand Hotel", "grand@example.com", "password123", "+90 555 000",
                "Main St 1", "Istanbul", "Turkey", "A nice hotel", "Jane Doe");
    }

    @Test
    void registerCreatesHotelAndHotelAdminUser() {
        HotelRegisterRequest request = sampleRequest();
        when(hotelRepository.existsByEmail("grand@example.com")).thenReturn(false);
        when(userRepository.existsByEmail("grand@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.HOTEL_ADMIN)).thenReturn(Optional.of(hotelAdminRole));
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");

        HotelRegisterResponse response = hotelService.register(request);

        ArgumentCaptor<Hotel> hotelCaptor = ArgumentCaptor.forClass(Hotel.class);
        verify(hotelRepository).save(hotelCaptor.capture());
        Hotel savedHotel = hotelCaptor.getValue();
        assertThat(savedHotel.getName()).isEqualTo("Grand Hotel");
        assertThat(savedHotel.getStatus()).isEqualTo(HotelStatus.PENDING);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo("grand@example.com");
        assertThat(savedUser.getPasswordHash()).isEqualTo("hashed-password");
        assertThat(savedUser.getRole()).isEqualTo(hotelAdminRole);

        verify(hotelUserRepository).save(any(HotelUser.class));

        assertThat(response.hotel().status()).isEqualTo(HotelStatus.PENDING);
        assertThat(response.auth().accessToken()).isNotBlank();
        assertThat(response.auth().user().role()).isEqualTo(RoleName.HOTEL_ADMIN);

        verify(emailService).sendHotelRegistrationEmail("grand@example.com", "Grand Hotel");
    }

    @Test
    void registerNotifiesAllAgencyAdminsOfNewApplication() {
        HotelRegisterRequest request = sampleRequest();
        when(hotelRepository.existsByEmail("grand@example.com")).thenReturn(false);
        when(userRepository.existsByEmail("grand@example.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.HOTEL_ADMIN)).thenReturn(Optional.of(hotelAdminRole));
        when(passwordEncoder.encode("password123")).thenReturn("hashed-password");

        User admin1 = new User();
        admin1.setEmail("admin1@agency.test");
        User admin2 = new User();
        admin2.setEmail("admin2@agency.test");
        when(userRepository.findByRole_Name(RoleName.AGENCY_ADMIN)).thenReturn(List.of(admin1, admin2));

        hotelService.register(request);

        verify(emailService).sendAdminNewHotelNotification(
                "admin1@agency.test", "Grand Hotel", "Jane Doe", "grand@example.com", "+90 555 000");
        verify(emailService).sendAdminNewHotelNotification(
                "admin2@agency.test", "Grand Hotel", "Jane Doe", "grand@example.com", "+90 555 000");
    }

    @Test
    void registerRejectsDuplicateEmail() {
        HotelRegisterRequest request = sampleRequest();
        when(hotelRepository.existsByEmail("grand@example.com")).thenReturn(true);

        assertThatThrownBy(() -> hotelService.register(request))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void approveSetsStatusActive() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.PENDING);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        hotelService.approve(1L);

        assertThat(hotel.getStatus()).isEqualTo(HotelStatus.ACTIVE);
    }

    @Test
    void rejectSetsStatusRejected() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.PENDING);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        hotelService.reject(1L);

        assertThat(hotel.getStatus()).isEqualTo(HotelStatus.REJECTED);
    }

    @Test
    void approveThrowsWhenHotelMissing() {
        when(hotelRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> hotelService.approve(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void hotelAdminCannotAccessAnotherHotel() {
        Hotel ownHotel = new Hotel();
        ownHotel.setId(1L);
        Hotel otherHotel = new Hotel();
        otherHotel.setId(2L);
        otherHotel.setStatus(HotelStatus.ACTIVE);

        User hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);

        when(hotelRepository.findById(2L)).thenReturn(Optional.of(otherHotel));
        when(hotelUserRepository.findByUserId(10L)).thenReturn(Optional.of(new HotelUser(ownHotel, hotelAdmin)));

        assertThatThrownBy(() -> hotelService.findById(2L, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void hotelAdminCanAccessOwnHotel() {
        Hotel ownHotel = new Hotel();
        ownHotel.setId(1L);
        ownHotel.setStatus(HotelStatus.PENDING);

        User hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(ownHotel));
        when(hotelUserRepository.findByUserId(10L)).thenReturn(Optional.of(new HotelUser(ownHotel, hotelAdmin)));

        var response = hotelService.findById(1L, hotelAdmin);

        assertThat(response.id()).isEqualTo(1L);
    }

    @Test
    void agencyStaffCannotViewPendingHotel() {
        Hotel pendingHotel = new Hotel();
        pendingHotel.setId(5L);
        pendingHotel.setStatus(HotelStatus.PENDING);

        User staff = new User();
        staff.setId(20L);
        staff.setRole(agencyStaffRole);

        when(hotelRepository.findById(5L)).thenReturn(Optional.of(pendingHotel));

        assertThatThrownBy(() -> hotelService.findById(5L, staff))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void findMineReturnsTheHotelLinkedToTheRequester() {
        Hotel ownHotel = new Hotel();
        ownHotel.setId(1L);
        ownHotel.setStatus(HotelStatus.ACTIVE);

        User hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(ownHotel));
        when(hotelUserRepository.findByUserId(10L)).thenReturn(Optional.of(new HotelUser(ownHotel, hotelAdmin)));

        var response = hotelService.findMine(hotelAdmin);

        assertThat(response.id()).isEqualTo(1L);
    }

    @Test
    void findMineRejectsNonHotelAdmin() {
        User staff = new User();
        staff.setId(20L);
        staff.setRole(agencyStaffRole);

        assertThatThrownBy(() -> hotelService.findMine(staff))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void updateRejectsNonOwnerHotelAdmin() {
        Hotel ownHotel = new Hotel();
        ownHotel.setId(1L);
        Hotel otherHotel = new Hotel();
        otherHotel.setId(2L);

        User hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);

        HotelUpdateRequest request = new HotelUpdateRequest(
                "New Name", "desc", "addr", "city", "country", "phone", "email@example.com", null, "contact");

        when(hotelRepository.findById(2L)).thenReturn(Optional.of(otherHotel));
        when(hotelUserRepository.findByUserId(10L)).thenReturn(Optional.of(new HotelUser(ownHotel, hotelAdmin)));

        assertThatThrownBy(() -> hotelService.update(2L, request, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void updateRejectsWhenHotelNotYetApproved() {
        Hotel ownHotel = new Hotel();
        ownHotel.setId(1L);
        ownHotel.setStatus(HotelStatus.PENDING);

        User hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);

        HotelUpdateRequest request = new HotelUpdateRequest(
                "New Name", "desc", "addr", "city", "country", "phone", "email@example.com", null, "contact");

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(ownHotel));
        when(hotelUserRepository.findByUserId(10L)).thenReturn(Optional.of(new HotelUser(ownHotel, hotelAdmin)));

        assertThatThrownBy(() -> hotelService.update(1L, request, hotelAdmin))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getOwnedHotelSucceedsOnceApproved() {
        Hotel ownHotel = new Hotel();
        ownHotel.setId(1L);
        ownHotel.setStatus(HotelStatus.ACTIVE);

        User hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setRole(hotelAdminRole);

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(ownHotel));
        when(hotelUserRepository.findByUserId(10L)).thenReturn(Optional.of(new HotelUser(ownHotel, hotelAdmin)));

        Hotel result = hotelService.getOwnedHotel(1L, hotelAdmin);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void listIncompleteHotelsExcludesHotelsWithAPricedRoomType() {
        Hotel incomplete = new Hotel();
        incomplete.setId(1L);
        incomplete.setName("Incomplete Hotel");
        incomplete.setStatus(HotelStatus.ACTIVE);

        Hotel complete = new Hotel();
        complete.setId(2L);
        complete.setName("Complete Hotel");
        complete.setStatus(HotelStatus.ACTIVE);

        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(incomplete, complete));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(false);
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(2L)).thenReturn(true);

        List<com.hotelagency.dto.hotel.IncompleteHotelSetupResponse> result = hotelService.listIncompleteHotels();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).hotelId()).isEqualTo(1L);
    }

    @Test
    void listPublicCatalogOnlyIncludesActiveHotelsWithAPricedRoomType() {
        Hotel noSetup = new Hotel();
        noSetup.setId(1L);
        noSetup.setStatus(HotelStatus.ACTIVE);

        Hotel ready = new Hotel();
        ready.setId(2L);
        ready.setName("Grand Hotel");
        ready.setCity("Istanbul");
        ready.setCountry("Turkey");
        ready.setStatus(HotelStatus.ACTIVE);

        com.hotelagency.entity.RoomType cheapest = new com.hotelagency.entity.RoomType();
        cheapest.setBasePrice(new java.math.BigDecimal("50.00"));
        cheapest.setCurrency("EUR");

        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(noSetup, ready));
        when(roomTypeRepository.findFirstByHotelIdAndBasePriceIsNotNullOrderByBasePriceAsc(1L))
                .thenReturn(Optional.empty());
        when(roomTypeRepository.findFirstByHotelIdAndBasePriceIsNotNullOrderByBasePriceAsc(2L))
                .thenReturn(Optional.of(cheapest));

        List<com.hotelagency.dto.hotel.PublicHotelResponse> result = hotelService.listPublicCatalog();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(2L);
        assertThat(result.get(0).name()).isEqualTo("Grand Hotel");
        assertThat(result.get(0).priceFrom()).isEqualByComparingTo("50.00");
        assertThat(result.get(0).currency()).isEqualTo("EUR");
    }

    @Test
    void sendManualSetupReminderRejectsAlreadyCompletedHotel() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.ACTIVE);

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(true);

        assertThatThrownBy(() -> hotelService.sendManualSetupReminder(1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void sendManualSetupReminderRejectsNonActiveHotel() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.PENDING);

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        assertThatThrownBy(() -> hotelService.sendManualSetupReminder(1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void sendManualSetupReminderEmailsOwnerAndAdminsAndLogsIt() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Grand Hotel");
        hotel.setStatus(HotelStatus.ACTIVE);

        User owner = new User();
        owner.setId(20L);
        owner.setEmail("owner@hotel.test");

        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(false);
        when(hotelUserRepository.findByHotelId(1L)).thenReturn(List.of(new HotelUser(hotel, owner)));
        when(userRepository.findByRole_Name(RoleName.AGENCY_ADMIN)).thenReturn(List.of());

        hotelService.sendManualSetupReminder(1L);

        verify(emailService).sendHotelSetupReminderEmail("owner@hotel.test", "Grand Hotel");
        assertThat(hotel.getSetupReminderSentAt()).isNotNull();

        ArgumentCaptor<com.hotelagency.entity.HotelSetupReminderLog> logCaptor =
                ArgumentCaptor.forClass(com.hotelagency.entity.HotelSetupReminderLog.class);
        verify(hotelSetupReminderLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getRecipients()).contains("owner@hotel.test");
    }

    @Test
    void deactivateSetsStatusInactive() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.ACTIVE);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        hotelService.deactivate(1L);

        assertThat(hotel.getStatus()).isEqualTo(HotelStatus.INACTIVE);
    }

    @Test
    void deactivateRejectsNonActiveHotel() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.PENDING);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        assertThatThrownBy(() -> hotelService.deactivate(1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void reactivateSetsStatusActive() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.INACTIVE);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        hotelService.reactivate(1L);

        assertThat(hotel.getStatus()).isEqualTo(HotelStatus.ACTIVE);
    }

    @Test
    void reactivateRejectsNonInactiveHotel() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setStatus(HotelStatus.ACTIVE);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));

        assertThatThrownBy(() -> hotelService.reactivate(1L))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void deleteRejectsHotelWithReservations() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(reservationRepository.existsByHotelId(1L)).thenReturn(true);

        assertThatThrownBy(() -> hotelService.delete(1L))
                .isInstanceOf(IllegalArgumentException.class);

        verify(hotelRepository, org.mockito.Mockito.never()).delete(any());
    }

    @Test
    void deleteCascadesThroughOwnedResourcesThenTheHotel() {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(hotel));
        when(reservationRepository.existsByHotelId(1L)).thenReturn(false);

        com.hotelagency.entity.RoomType roomType = new com.hotelagency.entity.RoomType();
        roomType.setId(5L);
        when(roomTypeRepository.findByHotelId(1L)).thenReturn(List.of(roomType));
        when(roomImageRepository.findByRoomTypeId(5L)).thenReturn(List.of());

        User owner = new User();
        owner.setId(10L);
        HotelUser link = new HotelUser(hotel, owner);
        when(hotelUserRepository.findByHotelId(1L)).thenReturn(List.of(link));
        when(passwordResetTokenRepository.findByUserId(10L)).thenReturn(List.of());

        hotelService.delete(1L);

        verify(supportMessageRepository).deleteAll(any());
        verify(hotelSetupReminderLogRepository).deleteAll(any());
        verify(roomTypeRepository).deleteAll(List.of(roomType));
        verify(amenityRepository).deleteAll(any());
        verify(hotelUserRepository).delete(link);
        verify(userRepository).delete(owner);
        verify(hotelRepository).delete(hotel);
    }
}
