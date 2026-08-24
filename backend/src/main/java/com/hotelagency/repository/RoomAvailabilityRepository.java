package com.hotelagency.repository;

import com.hotelagency.entity.RoomAvailability;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {
    List<RoomAvailability> findByRoomTypeId(Long roomTypeId);

    Optional<RoomAvailability> findByRoomTypeIdAndDate(Long roomTypeId, LocalDate date);
}
