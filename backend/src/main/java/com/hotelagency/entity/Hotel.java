package com.hotelagency.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "description")
    private String description;

    @Column(name = "contact_person", nullable = false)
    private String contactPerson;

    @Column(name = "website")
    private String website;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private HotelStatus status = HotelStatus.PENDING;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "setup_reminder_sent_at")
    private Instant setupReminderSentAt;

    /** When the hotel side last opened the support thread (unread = an agency message after this). */
    @Column(name = "hotel_support_read_at")
    private Instant hotelSupportReadAt;

    /** When the agency side last opened this hotel's support thread (unread = a hotel message after this). */
    @Column(name = "agency_support_read_at")
    private Instant agencySupportReadAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
