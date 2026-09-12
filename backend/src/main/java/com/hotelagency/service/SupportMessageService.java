package com.hotelagency.service;

import com.hotelagency.dto.support.SupportMessageCreateRequest;
import com.hotelagency.dto.support.SupportMessageResponse;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.SupportMessage;
import com.hotelagency.entity.User;
import com.hotelagency.repository.SupportMessageRepository;
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

    @Transactional(readOnly = true)
    public List<SupportMessageResponse> listByHotel(Long hotelId, User requester) {
        Hotel hotel = hotelService.getViewableHotel(hotelId, requester);
        return supportMessageRepository.findByHotelIdOrderByCreatedAtAsc(hotel.getId()).stream()
                .map(SupportMessageResponse::from)
                .toList();
    }

    @Transactional
    public SupportMessageResponse send(Long hotelId, SupportMessageCreateRequest request, User requester) {
        Hotel hotel = hotelService.getViewableHotel(hotelId, requester);

        SupportMessage message = new SupportMessage(hotel, requester, request.body());
        supportMessageRepository.save(message);

        notifyNewMessage(hotel, requester);

        return SupportMessageResponse.from(message);
    }

    private void notifyNewMessage(Hotel hotel, User sender) {
        if (sender.getRole().getName() == RoleName.HOTEL_ADMIN) {
            hotelService.resolveAgencyAdminEmails()
                    .forEach(email -> emailService.sendSupportMessageNotification(email, hotel.getName(), sender.getFullName()));
        } else {
            hotelService.resolveHotelOwnerEmails(hotel)
                    .forEach(email -> emailService.sendSupportMessageNotification(email, hotel.getName(), sender.getFullName()));
        }
    }
}
