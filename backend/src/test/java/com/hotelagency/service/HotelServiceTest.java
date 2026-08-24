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
import com.hotelagency.repository.HotelRepository;
import com.hotelagency.repository.HotelUserRepository;
import com.hotelagency.repository.RoleRepository;
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

    private HotelService hotelService;

    private Role hotelAdminRole;
    private Role agencyAdminRole;
    private Role agencyStaffRole;

    @BeforeEach
    void setUp() {
        JwtService jwtService = new JwtService("test-secret-key-for-jwt-signing-must-be-long-enough", 3_600_000L, 604_800_000L);
        hotelService = new HotelService(hotelRepository, hotelUserRepository, userRepository, roleRepository, passwordEncoder, jwtService, emailService);

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
}
