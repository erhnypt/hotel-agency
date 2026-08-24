package com.hotelagency.service;

import com.hotelagency.dto.auth.AuthResponse;
import com.hotelagency.dto.auth.UserSummary;
import com.hotelagency.dto.hotel.HotelRegisterRequest;
import com.hotelagency.dto.hotel.HotelRegisterResponse;
import com.hotelagency.dto.hotel.HotelResponse;
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
import lombok.RequiredArgsConstructor;
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
        userRepository.findByRole_Name(RoleName.AGENCY_ADMIN)
                .forEach(admin -> emailService.sendAdminNewHotelNotification(
                        admin.getEmail(), hotel.getName(), hotel.getContactPerson(), hotel.getEmail(), hotel.getPhone()));
    }

    public List<HotelResponse> findAll(User requester) {
        List<Hotel> hotels = requester.getRole().getName() == RoleName.AGENCY_STAFF
                ? hotelRepository.findByStatus(HotelStatus.ACTIVE)
                : hotelRepository.findAll();

        return hotels.stream().map(HotelResponse::from).toList();
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
        emailService.sendHotelApprovalEmail(hotel.getEmail(), hotel.getName());
        return HotelResponse.from(hotel);
    }

    @Transactional
    public HotelResponse reject(Long id) {
        Hotel hotel = getHotelOrThrow(id);
        hotel.setStatus(HotelStatus.REJECTED);
        return HotelResponse.from(hotel);
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
