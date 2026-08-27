package com.hotelagency.repository;

import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.ReservationStatus;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByCreatedById(Long userId);

    List<Reservation> findByHotelId(Long hotelId);

    /**
     * Counts reservations for a room type whose stay overlaps [checkIn, checkOut)
     * and whose status is one of the given (active) statuses. Two date ranges
     * overlap when each starts before the other ends.
     */
    @Query("""
            select count(r) from Reservation r
            where r.roomType.id = :roomTypeId
              and r.status in :statuses
              and r.checkIn < :checkOut
              and r.checkOut > :checkIn
            """)
    long countOverlapping(
            @Param("roomTypeId") Long roomTypeId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("statuses") Collection<ReservationStatus> statuses);
}
