package com.hotelagency.service;

import com.hotelagency.dto.support.SupportMessageCreateRequest;
import com.hotelagency.dto.support.SupportMessageResponse;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.SupportMessage;
import com.hotelagency.entity.User;
import com.hotelagency.repository.SupportMessageRepository;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SupportMessageService {

    private final SupportMessageRepository supportMessageRepository;
    private final HotelService hotelService;
    private final EmailService emailService;

    /** Listing a thread also marks it as read for the caller's side (hotel vs. agency). */
    @Transactional
    public List<SupportMessageResponse> listByHotel(Long hotelId, User requester) {
        Hotel hotel = hotelService.getViewableHotel(hotelId, requester);
        markRead(hotel, requester);
        return supportMessageRepository.findByHotelIdOrderByCreatedAtAsc(hotel.getId()).stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    @Transactional
    public SupportMessageResponse send(Long hotelId, SupportMessageCreateRequest request, User requester) {
        Hotel hotel = hotelService.getViewableHotel(hotelId, requester);

        SupportMessage message = new SupportMessage(hotel, requester, request.body());
        supportMessageRepository.save(message);

        notifyNewMessage(hotel, requester, request.body());

        return SupportMessageResponse.from(message);
    }

    @Transactional(readOnly = true)
    public boolean hasUnreadForMyHotel(User requester) {
        Hotel hotel = hotelService.getViewableHotel(hotelService.requireOwnHotelId(requester), requester);
        return isUnreadForHotel(hotel);
    }

    @Transactional(readOnly = true)
    public List<Long> listHotelIdsWithUnreadForAgency(User requester) {
        return hotelService.listVisibleHotels(requester).stream()
                .filter(this::isUnreadForAgency)
                .map(Hotel::getId)
                .toList();
    }

    private void markRead(Hotel hotel, User requester) {
        Instant now = Instant.now();
        if (requester.getRole().getName() == RoleName.HOTEL_ADMIN) {
            hotel.setHotelSupportReadAt(now);
        } else {
            hotel.setAgencySupportReadAt(now);
        }
    }

    /** True if the latest message is from the agency and the hotel hasn't opened the thread since. */
    private boolean isUnreadForHotel(Hotel hotel) {
        return supportMessageRepository.findTopByHotelIdOrderByCreatedAtDesc(hotel.getId())
                .filter(message -> message.getSender().getRole().getName() != RoleName.HOTEL_ADMIN)
                .filter(message -> hotel.getHotelSupportReadAt() == null
                        || message.getCreatedAt().isAfter(hotel.getHotelSupportReadAt()))
                .isPresent();
    }

    /** True if the latest message is from the hotel and the agency hasn't opened the thread since. */
    private boolean isUnreadForAgency(Hotel hotel) {
        return supportMessageRepository.findTopByHotelIdOrderByCreatedAtDesc(hotel.getId())
                .filter(message -> message.getSender().getRole().getName() == RoleName.HOTEL_ADMIN)
                .filter(message -> hotel.getAgencySupportReadAt() == null
                        || message.getCreatedAt().isAfter(hotel.getAgencySupportReadAt()))
                .isPresent();
    }

    private void notifyNewMessage(Hotel hotel, User sender, String messageBody) {
        if (sender.getRole().getName() == RoleName.HOTEL_ADMIN) {
            hotelService.resolveAgencyAdminEmails()
                    .forEach(email -> emailService.sendSupportMessageNotification(
                            email, hotel.getName(), sender.getFullName(), messageBody));
        } else {
            hotelService.resolveHotelOwnerEmails(hotel)
                    .forEach(email -> emailService.sendSupportMessageNotification(
                            email, hotel.getName(), sender.getFullName(), messageBody));
        }
    }
}
