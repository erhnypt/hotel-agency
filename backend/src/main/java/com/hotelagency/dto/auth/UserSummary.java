package com.hotelagency.dto.auth;

import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;

public record UserSummary(Long id, String email, String fullName, RoleName role) {

    public static UserSummary from(User user) {
        return new UserSummary(user.getId(), user.getEmail(), user.getFullName(), user.getRole().getName());
    }
}
