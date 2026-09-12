package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.support.SupportMessageCreateRequest;
import com.hotelagency.dto.support.SupportMessageResponse;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.SupportMessage;
import com.hotelagency.entity.User;
import com.hotelagency.repository.SupportMessageRepository;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SupportMessageServiceTest {

    @Mock
    private SupportMessageRepository supportMessageRepository;
    @Mock
    private HotelService hotelService;
    @Mock
    private EmailService emailService;

    private SupportMessageService supportMessageService;

    private Hotel hotel;
    private User hotelAdmin;
    private User agencyAdmin;

    @BeforeEach
    void setUp() {
        supportMessageService = new SupportMessageService(supportMessageRepository, hotelService, emailService);

        hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Grand Hotel");

        Role hotelAdminRole = new Role(RoleName.HOTEL_ADMIN);
        hotelAdminRole.setId(3L);
        hotelAdmin = new User();
        hotelAdmin.setId(10L);
        hotelAdmin.setFullName("Hotel Owner");
        hotelAdmin.setRole(hotelAdminRole);

        Role agencyAdminRole = new Role(RoleName.AGENCY_ADMIN);
        agencyAdminRole.setId(1L);
        agencyAdmin = new User();
        agencyAdmin.setId(20L);
        agencyAdmin.setFullName("Agency Admin");
        agencyAdmin.setRole(agencyAdminRole);
    }

    @Test
    void listByHotelChecksVisibilityThenReturnsMessagesInOrder() {
        SupportMessage message = new SupportMessage(hotel, hotelAdmin, "Merhaba");
        when(hotelService.getViewableHotel(1L, hotelAdmin)).thenReturn(hotel);
        when(supportMessageRepository.findByHotelIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(message));

        List<SupportMessageResponse> result = supportMessageService.listByHotel(1L, hotelAdmin);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).body()).isEqualTo("Merhaba");
        verify(hotelService).getViewableHotel(1L, hotelAdmin);
    }

    @Test
    void sendFromHotelAdminNotifiesAgencyAdmins() {
        when(hotelService.getViewableHotel(1L, hotelAdmin)).thenReturn(hotel);
        when(hotelService.resolveAgencyAdminEmails()).thenReturn(Set.of("admin@hotel.test"));

        SupportMessageResponse response = supportMessageService.send(
                1L, new SupportMessageCreateRequest("Yardım lazım"), hotelAdmin);

        assertThat(response.body()).isEqualTo("Yardım lazım");
        assertThat(response.senderRole()).isEqualTo(RoleName.HOTEL_ADMIN);

        ArgumentCaptor<SupportMessage> captor = ArgumentCaptor.forClass(SupportMessage.class);
        verify(supportMessageRepository).save(captor.capture());
        assertThat(captor.getValue().getSender()).isEqualTo(hotelAdmin);

        verify(emailService).sendSupportMessageNotification("admin@hotel.test", "Grand Hotel", "Hotel Owner");
        verify(hotelService, never()).resolveHotelOwnerEmails(any());
    }

    @Test
    void sendFromAgencyNotifiesHotelOwner() {
        when(hotelService.getViewableHotel(1L, agencyAdmin)).thenReturn(hotel);
        when(hotelService.resolveHotelOwnerEmails(hotel)).thenReturn(List.of("owner@hotel.test"));

        supportMessageService.send(1L, new SupportMessageCreateRequest("Merhaba, size nasıl yardımcı olabiliriz?"), agencyAdmin);

        verify(emailService).sendSupportMessageNotification(
                eq("owner@hotel.test"), eq("Grand Hotel"), eq("Agency Admin"));
        verify(hotelService, never()).resolveAgencyAdminEmails();
    }
}
