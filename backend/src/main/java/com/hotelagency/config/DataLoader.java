package com.hotelagency.config;

import com.hotelagency.entity.Role;
import com.hotelagency.entity.RoleName;
import com.hotelagency.entity.User;
import com.hotelagency.repository.RoleRepository;
import com.hotelagency.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only create test users if they don't already exist
        if (!userRepository.existsByEmail("admin@hotel.test")) {
            createTestUsers();
        }
    }

    private void createTestUsers() {
        // Get roles
        Role adminRole = roleRepository.findByName(RoleName.AGENCY_ADMIN)
                .orElseThrow(() -> new RuntimeException("AGENCY_ADMIN role not found"));
        Role staffRole = roleRepository.findByName(RoleName.AGENCY_STAFF)
                .orElseThrow(() -> new RuntimeException("AGENCY_STAFF role not found"));
        Role hotelRole = roleRepository.findByName(RoleName.HOTEL_ADMIN)
                .orElseThrow(() -> new RuntimeException("HOTEL_ADMIN role not found"));

        // Create Agency Admin
        User admin = new User();
        admin.setEmail("admin@hotel.test");
        admin.setFullName("Test Admin");
        admin.setPasswordHash(passwordEncoder.encode("Admin@123456"));
        admin.setRole(adminRole);
        admin.setEnabled(true);
        userRepository.save(admin);

        // Create Agency Staff
        User staff = new User();
        staff.setEmail("staff@hotel.test");
        staff.setFullName("Test Staff");
        staff.setPasswordHash(passwordEncoder.encode("Staff@123456"));
        staff.setRole(staffRole);
        staff.setEnabled(true);
        userRepository.save(staff);

        // Create Hotel Admin
        User hotelAdmin = new User();
        hotelAdmin.setEmail("hotel@hotel.test");
        hotelAdmin.setFullName("Test Hotel Manager");
        hotelAdmin.setPasswordHash(passwordEncoder.encode("Hotel@123456"));
        hotelAdmin.setRole(hotelRole);
        hotelAdmin.setEnabled(true);
        userRepository.save(hotelAdmin);

        System.out.println("✓ Test users created successfully");
    }
}
