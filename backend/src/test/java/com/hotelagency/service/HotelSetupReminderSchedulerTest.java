package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelSetupReminderLog;
import com.hotelagency.entity.HotelStatus;
import com.hotelagency.repository.HotelRepository;
import com.hotelagency.repository.HotelSetupReminderLogRepository;
import com.hotelagency.repository.RoomTypeRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class HotelSetupReminderSchedulerTest {

    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private RoomTypeRepository roomTypeRepository;
    @Mock
    private HotelService hotelService;
    @Mock
    private EmailService emailService;
    @Mock
    private HotelSetupReminderLogRepository hotelSetupReminderLogRepository;

    private HotelSetupReminderScheduler scheduler;
    private Hotel hotel;

    @BeforeEach
    void setUp() {
        scheduler = new HotelSetupReminderScheduler(
                hotelRepository, roomTypeRepository, hotelService, emailService, hotelSetupReminderLogRepository);

        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Grand Hotel");
        hotel.setStatus(HotelStatus.ACTIVE);
    }

    @Test
    void skipsHotelWithoutApprovedAt() {
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));

        scheduler.remindIncompleteHotels();

        verify(emailService, never()).sendHotelSetupReminderEmail(any(), any());
    }

    @Test
    void skipsHotelThatAlreadyHasAPricedRoomType() {
        hotel.setApprovedAt(Instant.now().minus(13, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(true);

        scheduler.remindIncompleteHotels();

        verify(emailService, never()).sendHotelSetupReminderEmail(any(), any());
    }

    @Test
    void skipsHotelNotYetDueSinceApproval() {
        hotel.setApprovedAt(Instant.now().minus(5, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(false);

        scheduler.remindIncompleteHotels();

        verify(emailService, never()).sendHotelSetupReminderEmail(any(), any());
    }

    @Test
    void sendsFirstReminderTwelveHoursAfterApproval() {
        hotel.setApprovedAt(Instant.now().minus(13, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(false);
        when(hotelService.resolveHotelOwnerEmails(hotel)).thenReturn(List.of("owner@hotel.test"));
        when(hotelService.resolveAgencyAdminEmails()).thenReturn(Set.of("admin@hotel.test"));

        scheduler.remindIncompleteHotels();

        verify(emailService).sendHotelSetupReminderEmail("owner@hotel.test", "Grand Hotel");
        verify(emailService).sendHotelSetupReminderAdminNotification("admin@hotel.test", "Grand Hotel");
        assertThat(hotel.getSetupReminderSentAt()).isNotNull();

        ArgumentCaptor<HotelSetupReminderLog> logCaptor = ArgumentCaptor.forClass(HotelSetupReminderLog.class);
        verify(hotelSetupReminderLogRepository).save(logCaptor.capture());
        assertThat(logCaptor.getValue().getHotel()).isEqualTo(hotel);
        assertThat(logCaptor.getValue().getRecipients()).contains("owner@hotel.test", "admin@hotel.test");
    }

    @Test
    void skipsRepeatReminderWhenNotYetDueSinceLastReminder() {
        hotel.setApprovedAt(Instant.now().minus(30, ChronoUnit.HOURS));
        hotel.setSetupReminderSentAt(Instant.now().minus(2, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(false);

        scheduler.remindIncompleteHotels();

        verify(emailService, never()).sendHotelSetupReminderEmail(any(), any());
    }

    @Test
    void sendsRepeatReminderTwelveHoursAfterLastReminder() {
        hotel.setApprovedAt(Instant.now().minus(30, ChronoUnit.HOURS));
        hotel.setSetupReminderSentAt(Instant.now().minus(13, ChronoUnit.HOURS));
        when(hotelRepository.findByStatus(HotelStatus.ACTIVE)).thenReturn(List.of(hotel));
        when(roomTypeRepository.existsByHotelIdAndBasePriceIsNotNull(1L)).thenReturn(false);
        when(hotelService.resolveHotelOwnerEmails(hotel)).thenReturn(List.of("owner@hotel.test"));
        when(hotelService.resolveAgencyAdminEmails()).thenReturn(Set.of("admin@hotel.test"));

        scheduler.remindIncompleteHotels();

        verify(emailService).sendHotelSetupReminderEmail(eq("owner@hotel.test"), eq("Grand Hotel"));
        verify(emailService).sendHotelSetupReminderAdminNotification(eq("admin@hotel.test"), eq("Grand Hotel"));
    }
}
