package com.hotelagency.repository;

import com.hotelagency.entity.BookingRequest;
import com.hotelagency.entity.BookingRequestStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {
    List<BookingRequest> findAllByOrderByCreatedAtDesc();

    long countByStatus(BookingRequestStatus status);
}
