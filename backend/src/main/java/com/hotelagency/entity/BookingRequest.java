package com.hotelagency.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * A public enquiry from the landing-page hotel search. The property is picked
 * from the static catalog, so we store its display fields rather than a FK.
 */
@Entity
@Table(name = "booking_requests")
@Getter
@Setter
@NoArgsConstructor
public class BookingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false, length = 64)
    private String propertyId;

    @Column(name = "property_name", nullable = false)
    private String propertyName;

    @Column(name = "hotel_type", nullable = false, length = 32)
    private String hotelType;

    @Column(name = "property_city", length = 128)
    private String propertyCity;

    @Column(name = "country_code", length = 3)
    private String countryCode;

    @Column(name = "country_name", length = 128)
    private String countryName;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "guests", nullable = false)
    private Integer guests;

    @Column(name = "contact_name", nullable = false)
    private String contactName;

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "contact_phone", nullable = false, length = 50)
    private String contactPhone;

    @Column(name = "message")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private BookingRequestStatus status = BookingRequestStatus.NEW;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
