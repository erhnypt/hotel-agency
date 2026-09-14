package com.hotelagency.entity;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

/** Logs every time a hotel reveals a reservation's full card details, so the agency can be notified. */
@Entity
@Table(name = "card_view_logs")
@Getter
@Setter
@NoArgsConstructor
public class CardViewLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "viewed_by_user_id", nullable = false)
    private User viewedBy;

    @CreationTimestamp
    @Column(name = "viewed_at", nullable = false, updatable = false)
    private Instant viewedAt;

    @Column(name = "read_at")
    private Instant readAt;

    public CardViewLog(Reservation reservation, User viewedBy) {
        this.reservation = reservation;
        this.viewedBy = viewedBy;
    }
}
