package com.hotelagency.repository;

import com.hotelagency.entity.RoomType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    List<RoomType> findByHotelId(Long hotelId);

    boolean existsByHotelIdAndBasePriceIsNotNull(Long hotelId);

    Optional<RoomType> findFirstByHotelIdAndBasePriceIsNotNullOrderByBasePriceAsc(Long hotelId);
}
