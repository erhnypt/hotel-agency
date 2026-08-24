package com.hotelagency.repository;

import com.hotelagency.entity.RoomPrice;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomPriceRepository extends JpaRepository<RoomPrice, Long> {
    List<RoomPrice> findByRoomTypeId(Long roomTypeId);

    Optional<RoomPrice> findByRoomTypeIdAndDate(Long roomTypeId, LocalDate date);
}
