package com.hotelagency.service;

import com.hotelagency.dto.reservation.CardViewLogResponse;
import com.hotelagency.entity.CardViewLog;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.User;
import com.hotelagency.repository.CardViewLogRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CardViewLogService {

    private final CardViewLogRepository cardViewLogRepository;

    @Transactional
    public void record(Reservation reservation, User viewedBy) {
        cardViewLogRepository.save(new CardViewLog(reservation, viewedBy));
    }

    @Transactional(readOnly = true)
    public List<CardViewLogResponse> listRecent() {
        return cardViewLogRepository.findAllByOrderByViewedAtDesc().stream()
                .map(CardViewLogResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countUnread() {
        return cardViewLogRepository.countByReadAtIsNull();
    }

    @Transactional
    public void markAllRead() {
        cardViewLogRepository.markAllRead(Instant.now());
    }

    @Transactional
    public void deleteByReservationId(Long reservationId) {
        cardViewLogRepository.deleteByReservationId(reservationId);
    }
}
