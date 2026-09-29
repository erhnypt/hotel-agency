package com.hotelagency.repository;

import com.hotelagency.entity.ReservedRoom;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservedRoomRepository extends JpaRepository<ReservedRoom, Long> {

    List<ReservedRoom> findByReservationId(Long reservationId);

    void deleteByReservationId(Long reservationId);

    /** Ids of reservations that booked at least one room of the given hotel. */
    @Query("select rr.reservation.id from ReservedRoom rr where rr.reservation.hotel.id = :hotelId")
    List<Long> findReservationIdsByHotelId(@Param("hotelId") Long hotelId);

    /**
     * Availability check for a stay window: total booked quantity per room type
     * across all active-status reservations overlapping [checkIn, checkOut).
     */
    @Query("""
            select rr.roomType.id, sum(rr.quantity)
            from ReservedRoom rr
            where rr.roomType.id in :roomTypeIds
              and rr.reservation.status in :statuses
              and rr.reservation.checkIn < :checkOut
              and rr.reservation.checkOut > :checkIn
            group by rr.roomType.id
            """)
    List<Object[]> sumBookedQuantities(
            @Param("roomTypeIds") java.util.Collection<Long> roomTypeIds,
            @Param("checkIn") java.time.LocalDate checkIn,
            @Param("checkOut") java.time.LocalDate checkOut,
            @Param("statuses") java.util.Collection<com.hotelagency.entity.ReservationStatus> statuses);
}
