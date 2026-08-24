package com.hotelagency.repository;

import com.hotelagency.entity.Amenity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    List<Amenity> findByHotelId(Long hotelId);
}
