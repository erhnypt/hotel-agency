package com.hotelagency.service;

import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.UserSummary;
import com.hotelagency.dto.hotel.HotelRegisterRequest;
import com.hotelagency.dto.hotel.HotelRegisterResponse;
import com.hotelagency.dto.hotel.HotelResponse;
import com.hotelagency.dto.hotel.HotelSetupReminderLogResponse;
import com.hotelagency.dto.hotel.HotelUpdateRequest;
import com.hotelagency.dto.hotel.IncompleteHotelSetupResponse;
import com.hotelagency.dto.hotel.PublicHotelResponse;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelSetupReminderLog;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.entity.HotelUser;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.entity.RoomType;
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
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final HotelUserRepository hotelUserRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final HotelSetupReminderLogRepository hotelSetupReminderLogRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomImageRepository roomImageRepository;
    private final AmenityRepository amenityRepository;
    private final SupportMessageRepository supportMessageRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    /**
     * Extra addresses always notified of new hotel registrations, on top of the AGENCY_ADMIN users.
     * Comma-separated (e.g. {@code a@x.com,b@y.com}).
     */
    @Value("${app.notify.admin-email:}")
    private List<String> adminNotifyEmails;

    @Transactional
    public HotelRegisterResponse register(HotelRegisterRequest request) {
        if (hotelRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email is already registered: " + request.email());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email is already registered: " + request.email());
        }

        Role hotelAdminRole = roleRepository.findByName(RoleName.HOTEL_ADMIN)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + RoleName.HOTEL_ADMIN));

        Hotel hotel = new Hotel();
        hotel.setName(request.name());
        hotel.setEmail(request.email());
        hotel.setPhone(request.phone());
        hotel.setAddress(request.address());
        hotel.setCity(request.city());
        hotel.setCountry(request.country());
        hotel.setDescription(request.description());
        hotel.setContactPerson(request.contactPerson());
        hotel.setStatus(HotelStatus.PENDING);
        hotelRepository.save(hotel);

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.contactPerson());
        user.setRole(hotelAdminRole);
        userRepository.save(user);

        hotelUserRepository.save(new HotelUser(hotel, user));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        AuthResponse auth = new AuthResponse(accessToken, refreshToken, jwtService.getAccessExpirationMs(), UserSummary.from(user));

        emailService.sendHotelRegistrationEmail(hotel.getEmail(), hotel.getName());
        notifyAdminsOfNewRegistration(hotel);

        return new HotelRegisterResponse(HotelResponse.from(hotel), auth);
    }

    private void notifyAdminsOfNewRegistration(Hotel hotel) {
        resolveAgencyAdminEmails().forEach(email -> emailService.sendAdminNewHotelNotification(
                email, hotel.getName(), hotel.getContactPerson(), hotel.getEmail(), hotel.getPhone()));
    }

    /** Every AGENCY_ADMIN user's email, plus any extra addresses configured via {@code ADMIN_NOTIFY_EMAIL}. */
    public Set<String> resolveAgencyAdminEmails() {
        LinkedHashSet<String> recipients = new LinkedHashSet<>();
        userRepository.findByRole_Name(RoleName.AGENCY_ADMIN).forEach(admin -> recipients.add(admin.getEmail()));
        if (adminNotifyEmails != null) {
            adminNotifyEmails.forEach(recipients::add);
        }
        return recipients.stream()
                .filter(email -> email != null && !email.isBlank())
                .map(String::trim)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    /** The email(s) of the HOTEL_ADMIN user(s) linked to the given hotel. */
    public List<String> resolveHotelOwnerEmails(Hotel hotel) {
        return hotelUserRepository.findByHotelId(hotel.getId()).stream()
                .map(link -> link.getUser().getEmail())
                .filter(email -> email != null && !email.isBlank())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HotelSetupReminderLogResponse> listSetupReminderLogs() {
        return hotelSetupReminderLogRepository.findAllByOrderBySentAtDesc().stream()
                .map(HotelSetupReminderLogResponse::from)
                .toList();
    }

    /** True once a hotel has at least one room type with a nightly price set, i.e. it can take a booking. */
    public boolean hasCompletedSetup(Hotel hotel) {
        return roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(hotel.getId());
    }

    @Transactional(readOnly = true)
    public List<IncompleteHotelSetupResponse> listIncompleteHotels() {
        return hotelRepository.findByStatus(HotelStatus.ACTIVE).stream()
                .filter(hotel -> !hasCompletedSetup(hotel))
                .map(IncompleteHotelSetupResponse::from)
                .toList();
    }

    /** Active hotels that have finished setup, for the public landing-page search — unauthenticated. */
    @Transactional(readOnly = true)
    public List<PublicHotelResponse> listPublicCatalog() {
        return hotelRepository.findByStatus(HotelStatus.ACTIVE).stream()
                .map(hotel -> roomTypeRepository
                        .findFirstByHotelIdAndBasePriceIsNotNullOrderByBasePriceAsc(hotel.getId())
                        .map(cheapestRoomType -> PublicHotelResponse.from(hotel, cheapestRoomType)))
                .flatMap(Optional::stream)
                .toList();
    }

    /** Manually re-sends the setup reminder for a hotel, regardless of the usual 12h cadence. */
    @Transactional
    public void sendManualSetupReminder(Long hotelId) {
        Hotel hotel = getHotelOrThrow(hotelId);
        if (hotel.getStatus() != HotelStatus.ACTIVE) {
            throw new IllegalArgumentException("Sadece onaylanmış oteller için hatırlatma gönderilebilir");
        }
        if (hasCompletedSetup(hotel)) {
            throw new IllegalArgumentException("Bu otel kurulumunu zaten tamamlamış");
        }
        sendSetupReminder(hotel);
    }

    /** Emails the hotel owner and agency admins a setup reminder, and logs it. */
    @Transactional
    public void sendSetupReminder(Hotel hotel) {
        Instant now = Instant.now();
        LinkedHashSet<String> recipients = new LinkedHashSet<>();

        resolveHotelOwnerEmails(hotel).forEach(email -> {
            recipients.add(email);
            emailService.sendHotelSetupReminderEmail(email, hotel.getName());
        });
        resolveAgencyAdminEmails().forEach(email -> {
            recipients.add(email);
            emailService.sendHotelSetupReminderAdminNotification(email, hotel.getName());
        });

        hotel.setSetupReminderSentAt(now);
        hotelSetupReminderLogRepository.save(new HotelSetupReminderLog(hotel, String.join(", ", recipients), now));
    }

    public List<HotelResponse> findAll(User requester) {
        return listVisibleHotels(requester).stream().map(HotelResponse::from).toList();
    }

    /** The hotel entities a caller's role may see (AGENCY_STAFF is limited to ACTIVE hotels). */
    public List<Hotel> listVisibleHotels(User requester) {
        return requester.getRole().getName() == RoleName.AGENCY_STAFF
                ? hotelRepository.findByStatus(HotelStatus.ACTIVE)
                : hotelRepository.findAll();
    }

    public HotelResponse findById(Long id, User requester) {
        return HotelResponse.from(getViewableHotel(id, requester));
    }

    /**
     * Returns the hotel a HOTEL_ADMIN user manages, so the frontend can discover
     * "my hotel" without already knowing its id.
     */
    public HotelResponse findMine(User requester) {
        return findById(requireOwnHotelId(requester), requester);
    }

    /**
     * Loads a hotel while enforcing the same visibility rules as {@link #findById}.
     * Used by other services (e.g. room management) that need to confirm a caller
     * may see a given hotel before touching its sub-resources.
     */
    public Hotel getViewableHotel(Long id, User requester) {
        Hotel hotel = getHotelOrThrow(id);
        assertCanView(hotel, requester);
        return hotel;
    }

    /**
     * Loads a hotel while enforcing hotel-admin ownership, for services that manage
     * a hotel's sub-resources (room types, services, prices, ...).
     */
    public Hotel getOwnedHotel(Long id, User requester) {
        Hotel hotel = getHotelOrThrow(id);
        assertOwnsHotel(hotel, requester);
        if (hotel.getStatus() != HotelStatus.ACTIVE) {
            throw new AccessDeniedException("Hotel is not yet approved by the agency");
        }
        return hotel;
    }

    @Transactional
    public HotelResponse update(Long id, HotelUpdateRequest request, User requester) {
        Hotel hotel = getOwnedHotel(id, requester);

        hotel.setName(request.name());
        hotel.setDescription(request.description());
        hotel.setAddress(request.address());
        hotel.setCity(request.city());
        hotel.setCountry(request.country());
        hotel.setPhone(request.phone());
        hotel.setEmail(request.email());
        hotel.setWebsite(request.website());
        hotel.setContactPerson(request.contactPerson());

        return HotelResponse.from(hotel);
    }

    @Transactional
    public HotelResponse approve(Long id) {
        Hotel hotel = getHotelOrThrow(id);
        hotel.setStatus(HotelStatus.ACTIVE);
        hotel.setApprovedAt(Instant.now());
        emailService.sendHotelApprovalEmail(hotel.getEmail(), hotel.getName());
        return HotelResponse.from(hotel);
    }

    @Transactional
    public HotelResponse reject(Long id) {
        Hotel hotel = getHotelOrThrow(id);
        hotel.setStatus(HotelStatus.REJECTED);
        return HotelResponse.from(hotel);
    }

    /** Reversibly hides an approved hotel: it drops out of AGENCY_STAFF/staff listings and its own admin is locked out. */
    @Transactional
    public HotelResponse deactivate(Long id) {
        Hotel hotel = getHotelOrThrow(id);
        if (hotel.getStatus() != HotelStatus.ACTIVE) {
            throw new IllegalArgumentException("Sadece aktif oteller pasife alınabilir");
        }
        hotel.setStatus(HotelStatus.INACTIVE);
        return HotelResponse.from(hotel);
    }

    @Transactional
    public HotelResponse reactivate(Long id) {
        Hotel hotel = getHotelOrThrow(id);
        if (hotel.getStatus() != HotelStatus.INACTIVE) {
            throw new IllegalArgumentException("Sadece pasif oteller aktifleştirilebilir");
        }
        hotel.setStatus(HotelStatus.ACTIVE);
        return HotelResponse.from(hotel);
    }

    /**
     * Permanently deletes a hotel and everything it owns (room types/images, services,
     * support messages, setup-reminder logs, its hotel-admin account). Blocked when the
     * hotel has any reservations, since those carry real customer/booking history that
     * a hard delete must not destroy — deactivate it instead.
     */
    @Transactional
    public void delete(Long id) {
        Hotel hotel = getHotelOrThrow(id);
        if (reservationRepository.existsByHotelId(id)) {
            throw new IllegalArgumentException(
                    "Rezervasyonu olan bir otel silinemez. Önce oteli pasife alın.");
        }

        supportMessageRepository.deleteAll(supportMessageRepository.findByHotelIdOrderByCreatedAtAsc(id));
        hotelSetupReminderLogRepository.deleteAll(hotelSetupReminderLogRepository.findByHotelId(id));

        for (RoomType roomType : roomTypeRepository.findByHotelId(id)) {
            roomImageRepository.deleteAll(roomImageRepository.findByRoomTypeId(roomType.getId()));
        }
        roomTypeRepository.deleteAll(roomTypeRepository.findByHotelId(id));

        amenityRepository.deleteAll(amenityRepository.findByHotelId(id));

        for (HotelUser link : hotelUserRepository.findByHotelId(id)) {
            User owner = link.getUser();
            passwordResetTokenRepository.deleteAll(passwordResetTokenRepository.findByUserId(owner.getId()));
            hotelUserRepository.delete(link);
            userRepository.delete(owner);
        }

        hotelRepository.delete(hotel);
    }

    /**
     * Returns the id of the hotel a HOTEL_ADMIN user manages. Used by services that
     * need to scope a query to "my hotel" (e.g. listing reservations) without loading
     * a specific hotel first.
     */
    public Long requireOwnHotelId(User requester) {
        if (requester.getRole().getName() != RoleName.HOTEL_ADMIN) {
            throw new AccessDeniedException("Only a hotel admin has an owned hotel");
        }
        return hotelUserRepository.findByUserId(requester.getId())
                .orElseThrow(() -> new AccessDeniedException("User is not linked to any hotel"))
                .getHotel()
                .getId();
    }

    private Hotel getHotelOrThrow(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found: " + id));
    }

    private void assertCanView(Hotel hotel, User requester) {
        RoleName role = requester.getRole().getName();
        if (role == RoleName.HOTEL_ADMIN) {
            assertOwnsHotel(hotel, requester);
        } else if (role == RoleName.AGENCY_STAFF && hotel.getStatus() != HotelStatus.ACTIVE) {
            throw new AccessDeniedException("Hotel is not active");
        }
    }

    private void assertOwnsHotel(Hotel hotel, User requester) {
        if (requester.getRole().getName() != RoleName.HOTEL_ADMIN) {
            throw new AccessDeniedException("Only a hotel admin can manage a hotel profile");
        }
        HotelUser link = hotelUserRepository.findByUserId(requester.getId())
                .orElseThrow(() -> new AccessDeniedException("User is not linked to any hotel"));
        if (!link.getHotel().getId().equals(hotel.getId())) {
            throw new AccessDeniedException("You do not have access to this hotel");
        }
    }
}
