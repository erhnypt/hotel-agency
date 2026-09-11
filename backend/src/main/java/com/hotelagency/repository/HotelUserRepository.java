package com.hotelagency.repository;

import com.hotelagency.entity.HotelUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelUserRepository extends JpaRepository<HotelUser, Long> {
    Optional<HotelUser> findByUserId(Long userId);

    List<HotelUser> findByHotelId(Long hotelId);
}
