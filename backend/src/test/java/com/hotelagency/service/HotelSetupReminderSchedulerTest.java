package com.hotelagency.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.repository.HotelRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class HotelSetupReminderSchedulerTest {

    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private HotelService hotelService;

    private HotelSetupReminderScheduler scheduler;
    private Hotel hotel;

    @BeforeEach
    void setUp() {
        scheduler = new HotelSetupReminderScheduler(hotelRepository, hotelService);

        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Grand Hotel");
        hotel.setStatus(HotelStatus.ACTIVE);
    }

    @Test
    void skipsHotelWithoutApprovedAt() {
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));

        scheduler.remindIncompleteHotels();

        verify(hotelService, never()).sendSetupReminder(any());
    }

    @Test
    void skipsHotelThatAlreadyHasAPricedRoomType() {
        hotel.setApprovedAt(Instant.now().minus(13, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(hotelService.hasCompletedSetup(hotel)).thenReturn(true);

        scheduler.remindIncompleteHotels();

        verify(hotelService, never()).sendSetupReminder(any());
    }

    @Test
    void skipsHotelNotYetDueSinceApproval() {
        hotel.setApprovedAt(Instant.now().minus(5, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(hotelService.hasCompletedSetup(hotel)).thenReturn(false);

        scheduler.remindIncompleteHotels();

        verify(hotelService, never()).sendSetupReminder(any());
    }

    @Test
    void sendsFirstReminderTwelveHoursAfterApproval() {
        hotel.setApprovedAt(Instant.now().minus(13, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(hotelService.hasCompletedSetup(hotel)).thenReturn(false);

        scheduler.remindIncompleteHotels();

        verify(hotelService).sendSetupReminder(hotel);
    }

    @Test
    void skipsRepeatReminderWhenNotYetDueSinceLastReminder() {
        hotel.setApprovedAt(Instant.now().minus(30, ChronoUnit.HOURS));
        hotel.setSetupReminderSentAt(Instant.now().minus(2, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(hotelService.hasCompletedSetup(hotel)).thenReturn(false);

        scheduler.remindIncompleteHotels();

        verify(hotelService, never()).sendSetupReminder(any());
    }

    @Test
    void sendsRepeatReminderTwelveHoursAfterLastReminder() {
        hotel.setApprovedAt(Instant.now().minus(30, ChronoUnit.HOURS));
        hotel.setSetupReminderSentAt(Instant.now().minus(13, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(hotelService.hasCompletedSetup(hotel)).thenReturn(false);

        scheduler.remindIncompleteHotels();

        verify(hotelService).sendSetupReminder(hotel);
    }
}
