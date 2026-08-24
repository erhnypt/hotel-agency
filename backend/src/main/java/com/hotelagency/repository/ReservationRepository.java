package com.hotelagency.repository;

import com.hotelagency.entity.Reservation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCreatedById(Long userId);

    List<Reservation> findByHotelId(Long hotelId);
}
