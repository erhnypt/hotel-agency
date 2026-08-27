package com.hotelagency.service;

import com.hotelagency.dto.reservation.AvailableRoomResponse;
import com.hotelagency.dto.reservation.ReservationCreateRequest;
import com.hotelagency.dto.reservation.ReservationResponse;
import com.hotelagency.entity.Customer;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.ReservationStatus;
import com.hotelagency.entity.ReservationStatusHistory;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.RoomType;
import com.hotelagency.entity.User;
import com.hotelagency.exception.InvalidReservationException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.CustomerRepository;
import com.hotelagency.repository.ReservationRepository;
import com.hotelagency.repository.ReservationStatusHistoryRepository;
import com.hotelagency.repository.RoomTypeRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private static final long RESERVATION_NUMBER_OFFSET = 100_000L;

    /** Statuses that hold a room and therefore count against availability. */
    private static final List<ReservationStatus> ACTIVE_STATUSES =
            List.of(ReservationStatus.PENDING, ReservationStatus.CONFIRMED);

    private final ReservationRepository reservationRepository;
    private final ReservationStatusHistoryRepository historyRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;
    private final HotelService hotelService;

    @Transactional
    public ReservationResponse create(ReservationCreateRequest request, User requester) {
        if (!request.checkOut().isAfter(request.checkIn())) {
            throw new InvalidReservationException("Check-out date must be after check-in date");
        }

        Hotel hotel = hotelService.getViewableHotel(request.hotelId(), requester);
        RoomType roomType = roomTypeRepository.findById(request.roomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Room type not found: " + request.roomTypeId()));
        if (!roomType.getHotel().getId().equals(hotel.getId())) {
            throw new InvalidReservationException("Room type does not belong to the selected hotel");
        }
        if (roomType.getCapacity() < request.guests()) {
            throw new InvalidReservationException(
                    "Room type capacity is insufficient for " + request.guests() + " guests");
        }

        assertRoomFree(roomType, request.checkIn(), request.checkOut());
        List<LocalDate> nights = datesBetween(request.checkIn(), request.checkOut());
        PriceQuote quote = quotePrice(roomType, nights)
                .orElseThrow(() -> new InvalidReservationException("Nightly price is not set for this room type"));

        Customer customer = resolveCustomer(request);

        Reservation reservation = new Reservation();
        reservation.setHotel(hotel);
        reservation.setRoomType(roomType);
        reservation.setCustomer(customer);
        reservation.setCreatedBy(requester);
        reservation.setCheckIn(request.checkIn());
        reservation.setCheckOut(request.checkOut());
        reservation.setGuests(request.guests());
        reservation.setTotalPrice(quote.total());
        reservation.setCurrency(quote.currency());
        reservation.setStatus(ReservationStatus.PENDING);
        reservationRepository.save(reservation);

        reservation.setReservationNumber("RES-" + (RESERVATION_NUMBER_OFFSET + reservation.getId()));
        reservationRepository.save(reservation);

        recordHistory(reservation, ReservationStatus.PENDING);

        return ReservationResponse.from(reservation);
    }

    public List<AvailableRoomResponse> searchAvailableRooms(
            Long hotelId, LocalDate checkIn, LocalDate checkOut, Integer guests, User requester) {
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidReservationException("Check-out date must be after check-in date");
        }

        hotelService.getViewableHotel(hotelId, requester);
        List<LocalDate> nights = datesBetween(checkIn, checkOut);

        return roomTypeRepository.findByHotelId(hotelId).stream()
                .filter(roomType -> roomType.getCapacity() >= guests)
                .filter(roomType -> isRoomFree(roomType, checkIn, checkOut))
                .flatMap(roomType -> quotePrice(roomType, nights)
                        .map(quote -> new AvailableRoomResponse(
                                roomType.getId(),
                                roomType.getName(),
                                roomType.getDescription(),
                                roomType.getCapacity(),
                                roomType.getBedType(),
                                quote.total(),
                                quote.currency()))
                        .stream())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> findAll(User requester) {
        List<Reservation> reservations = switch (requester.getRole().getName()) {
            case AGENCY_ADMIN -> reservationRepository.findAll();
            case AGENCY_STAFF -> reservationRepository.findByCreatedById(requester.getId());
            case HOTEL_ADMIN -> reservationRepository.findByHotelId(hotelService.requireOwnHotelId(requester));
        };

        return reservations.stream().map(ReservationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ReservationResponse findById(Long id, User requester) {
        Reservation reservation = getReservationOrThrow(id);
        assertCanView(reservation, requester);
        return ReservationResponse.from(reservation);
    }

    @Transactional
    public ReservationResponse confirm(Long id, User requester) {
        Reservation reservation = getReservationOrThrow(id);
        assertHotelOwnership(reservation, requester);
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new InvalidReservationException("Only pending reservations can be confirmed");
        }

        reservation.setStatus(ReservationStatus.CONFIRMED);
        recordHistory(reservation, ReservationStatus.CONFIRMED);

        return ReservationResponse.from(reservation);
    }

    @Transactional
    public ReservationResponse reject(Long id, User requester) {
        Reservation reservation = getReservationOrThrow(id);
        assertHotelOwnership(reservation, requester);
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new InvalidReservationException("Only pending reservations can be rejected");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        recordHistory(reservation, ReservationStatus.REJECTED);

        return ReservationResponse.from(reservation);
    }

    @Transactional
    public ReservationResponse cancel(Long id, User requester) {
        Reservation reservation = getReservationOrThrow(id);
        if (!reservation.getCreatedBy().getId().equals(requester.getId())) {
            throw new AccessDeniedException("You can only cancel your own reservations");
        }
        if (reservation.getStatus() != ReservationStatus.PENDING && reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new InvalidReservationException("Only pending or confirmed reservations can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        recordHistory(reservation, ReservationStatus.CANCELLED);

        return ReservationResponse.from(reservation);
    }

    private Customer resolveCustomer(ReservationCreateRequest request) {
        if (request.customerId() != null) {
            return customerRepository.findById(request.customerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.customerId()));
        }
        if (request.newCustomer() == null) {
            throw new InvalidReservationException("Either customerId or newCustomer must be provided");
        }
        return customerService.createEntity(request.newCustomer());
    }

    private void assertCanView(Reservation reservation, User requester) {
        RoleName role = requester.getRole().getName();
        if (role == RoleName.AGENCY_STAFF && !reservation.getCreatedBy().getId().equals(requester.getId())) {
            throw new AccessDeniedException("You can only view your own reservations");
        }
        if (role == RoleName.HOTEL_ADMIN && !reservation.getHotel().getId().equals(hotelService.requireOwnHotelId(requester))) {
            throw new AccessDeniedException("You do not have access to this reservation");
        }
    }

    private void assertHotelOwnership(Reservation reservation, User requester) {
        if (!reservation.getHotel().getId().equals(hotelService.requireOwnHotelId(requester))) {
            throw new AccessDeniedException("You do not have access to this reservation");
        }
    }

    private void assertRoomFree(RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        if (!isRoomFree(roomType, checkIn, checkOut)) {
            throw new InvalidReservationException(
                    "No rooms of this type are available for the selected dates");
        }
    }

    /** A room type is free when its total room count exceeds the overlapping active reservations. */
    private boolean isRoomFree(RoomType roomType, LocalDate checkIn, LocalDate checkOut) {
        long booked = reservationRepository.countOverlapping(
                roomType.getId(), checkIn, checkOut, ACTIVE_STATUSES);
        return roomType.getNumberOfRooms() - booked >= 1;
    }

    private Optional<PriceQuote> quotePrice(RoomType roomType, List<LocalDate> nights) {
        if (roomType.getBasePrice() == null) {
            return Optional.empty();
        }
        BigDecimal total = roomType.getBasePrice().multiply(BigDecimal.valueOf(nights.size()));
        return Optional.of(new PriceQuote(total, roomType.getCurrency()));
    }

    private void recordHistory(Reservation reservation, ReservationStatus status) {
        historyRepository.save(new ReservationStatusHistory(reservation, status));
    }

    private List<LocalDate> datesBetween(LocalDate checkIn, LocalDate checkOut) {
        return checkIn.datesUntil(checkOut).toList();
    }

    private Reservation getReservationOrThrow(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));
    }

    private record PriceQuote(BigDecimal total, String currency) {
    }
}
