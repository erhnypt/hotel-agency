package com.hotelagency.dto.staff;

import com.hotelagency.entity.User;
import java.time.Instant;

public record StaffResponse(Long id, String fullName, String email, Instant createdAt) {

    public static StaffResponse from(User user) {
        return new StaffResponse(user.getId(), user.getFullName(), user.getEmail(), user.getCreatedAt());
    }
}
