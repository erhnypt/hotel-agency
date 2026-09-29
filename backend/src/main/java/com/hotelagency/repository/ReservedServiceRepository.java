package com.hotelagency.repository;

import com.hotelagency.entity.ReservedService;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservedServiceRepository extends JpaRepository<ReservedService, Long> {

    List<ReservedService> findByReservationId(Long reservationId);

    void deleteByReservationId(Long reservationId);

    /**
     * Hard-deletes rows without loading them, so a read-only flow (e.g. public
     * catalog deletion) can still clean up without a flushing transaction.
     */
    @Transactional
    void deleteInBatchByReservationId(Long reservationId);

    /** Ids of reservations that booked at least one service of the given hotel. */
    @Query("select rs.reservation.id from ReservedService rs where rs.reservation.hotel.id = :hotelId")
    List<Long> findReservationIdsByHotelId(@Param("hotelId") Long hotelId);
}
