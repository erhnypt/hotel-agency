package com.hotelagency.controller;

import com.hotelagency.service.EmailService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/email-diagnostics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('AGENCY_ADMIN')")
public class EmailDiagnosticsController {

    private final EmailService emailService;

    @GetMapping
    public List<EmailService.EmailAttempt> recent() {
        return emailService.getRecentAttempts();
    }
}
