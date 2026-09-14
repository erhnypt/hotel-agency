package com.hotelagency.repository;

import com.hotelagency.entity.CardViewLog;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CardViewLogRepository extends JpaRepository<CardViewLog, Long> {
    List<CardViewLog> findAllByOrderByViewedAtDesc();

    long countByReadAtIsNull();

    void deleteByReservationId(Long reservationId);

    @Modifying
    @Query("update CardViewLog c set c.readAt = :now where c.readAt is null")
    void markAllRead(Instant now);
}
