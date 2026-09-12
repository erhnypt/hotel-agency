package com.hotelagency.repository;

import com.hotelagency.entity.SupportMessage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    List<SupportMessage> findByHotelIdOrderByCreatedAtAsc(Long hotelId);
}
