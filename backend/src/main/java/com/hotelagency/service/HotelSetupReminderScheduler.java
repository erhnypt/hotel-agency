package com.hotelagency.service;

import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.repository.HotelRepository;
import java.time.Duration;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Nags a hotel that was approved but never finished setup (no room type with
 * a price yet, so it can't actually take a booking): one reminder 12h after
 * approval, then every 12h after that, until a priced room type exists.
 * Hotels approved before this feature shipped have no {@code approvedAt} and
 * are skipped, since we don't know their real approval time.
 */
@Component
@RequiredArgsConstructor
public class HotelSetupReminderScheduler {

    private static final Duration REMINDER_INTERVAL = Duration.ofHours(12);

    private final HotelRepository hotelRepository;
    private final HotelService hotelService;

    @Scheduled(fixedRate = 60 * 60 * 1000)
    @Transactional
    public void remindIncompleteHotels() {
        Instant now = Instant.now();

        for (Hotel hotel : hotelRepository.findByStatus(HotelStatus.ACTIVE)) {
            if (hotel.getApprovedAt() == null) {
                continue;
            }
            if (hotelService.hasCompletedSetup(hotel)) {
                continue;
            }

            Instant reference = hotel.getSetupReminderSentAt() != null ? hotel.getSetupReminderSentAt() : hotel.getApprovedAt();
            if (Duration.between(reference, now).compareTo(REMINDER_INTERVAL) < 0) {
                continue;
            }

            hotelService.sendSetupReminder(hotel);
        }
    }
}
