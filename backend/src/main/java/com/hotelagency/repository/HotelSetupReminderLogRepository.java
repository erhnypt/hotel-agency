package com.hotelagency.repository;

import com.hotelagency.entity.HotelSetupReminderLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelSetupReminderLogRepository extends JpaRepository<HotelSetupReminderLog, Long> {
    List<HotelSetupReminderLog> findAllByOrderBySentAtDesc();
}
