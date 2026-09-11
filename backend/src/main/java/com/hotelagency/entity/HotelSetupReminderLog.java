package com.hotelagency.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hotel_setup_reminder_logs")
@Getter
@Setter
@NoArgsConstructor
public class HotelSetupReminderLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(name = "recipients", nullable = false, columnDefinition = "TEXT")
    private String recipients;

    @Column(name = "sent_at", nullable = false)
    private Instant sentAt;

    public HotelSetupReminderLog(Hotel hotel, String recipients, Instant sentAt) {
        this.hotel = hotel;
        this.recipients = recipients;
        this.sentAt = sentAt;
    }
}
