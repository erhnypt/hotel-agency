package com.hotelagency.repository;

import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.HotelStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    boolean existsByEmail(String email);

    List<Hotel> findByStatus(HotelStatus status);
}
