package com.hotelagency.service;

import com.hotelagency.dto.staff.StaffRequest;
import com.hotelagency.dto.staff.StaffResponse;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.exception.DuplicateResourceException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.RoleRepository;
import com.hotelagency.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public List<StaffResponse> findAll() {
        return userRepository.findByRole_Name(RoleName.AGENCY_STAFF)
                .stream()
                .map(StaffResponse::from)
                .toList();
    }

    @Transactional
    public StaffResponse create(StaffRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email is already in use: " + request.email());
        }
        var staffRole = roleRepository.findByName(RoleName.AGENCY_STAFF)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: AGENCY_STAFF"));

        User user = new User();
        user.setEmail(request.email());
        user.setFullName(request.fullName());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(staffRole);
        return StaffResponse.from(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member not found: " + id));
        if (user.getRole().getName() != RoleName.AGENCY_STAFF) {
            throw new AccessDeniedException("Cannot delete a non-staff user through this endpoint");
        }
        userRepository.delete(user);
    }
}
