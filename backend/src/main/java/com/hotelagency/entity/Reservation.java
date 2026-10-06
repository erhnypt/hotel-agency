package com.hotelagency.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_number", unique = true)
    private String reservationNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "guests", nullable = false)
    private Integer guests;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "paid", nullable = false)
    private boolean paid = false;

    @Column(name = "paid_at")
    private Instant paidAt;

    /** Agency-admin switch: when false the hotel can never see this reservation's card, even while it is active. */
    @Column(name = "card_visible_to_hotel", nullable = false)
    private boolean cardVisibleToHotel = true;

    @OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY)
    private List<ReservedService> services = new ArrayList<>();

    @OneToMany(mappedBy = "reservation", fetch = FetchType.LAZY)
    private List<ReservedRoom> rooms = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    /**
     * The hotel may see the card only while the reservation is still open (pending/confirmed, unpaid, not yet
     * checked out) and the agency admin hasn't switched access off.
     */
    public boolean isCardAvailableToHotel() {
        boolean open = status == ReservationStatus.PENDING || status == ReservationStatus.CONFIRMED;
        return cardVisibleToHotel && open && !paid && !checkOut.isBefore(LocalDate.now());
    }
}
