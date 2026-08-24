package com.hotelagency.repository;

import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole_Name(RoleName roleName);
}
