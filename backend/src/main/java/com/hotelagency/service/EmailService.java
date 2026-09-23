package com.hotelagency.service;

import java.time.Instant;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * Sends mail through Resend's HTTP API rather than SMTP: Render blocks outbound
 * SMTP ports (25/465/587) on every plan, so a plain JavaMailSender can never
 * connect regardless of credentials.
 */
@Service
public class EmailService {

    private static final String BRAND_BG = "#0a0b0d";
    private static final String BRAND_SIGNAL = "#ffb238";
    private static final String BRAND_SIGNAL_INK = "#1a1200";
    private static final int MAX_LOGGED_ATTEMPTS = 30;

    public record EmailAttempt(Instant timestamp, String kind, String toEmail, boolean success, String error) {
    }

    private final Deque<EmailAttempt> recentAttempts = new ArrayDeque<>();
    private final RestClient restClient = RestClient.create("https://api.resend.com");

    @Value("${app.mail.resend-api-key:}")
    private String resendApiKey;

    @Value("${app.mail.from:onboarding@resend.dev}")
    private String fromAddress;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Async
    public void sendHotelRegistrationEmail(String toEmail, String hotelName) {
        String body = wrapCorporateTemplate(
                "Application Received",
                """
                <p>Hello,</p>
                <p>Your hotel registration for <strong>%s</strong> has been received successfully.</p>
                <p>Your application is currently being reviewed by our agency team. You will receive a
                separate notification email once the review has been completed.</p>
                <p>After approval, you will be able to log in to the hotel management panel using the email
                address and password you set during registration to enter your room types, rates, and
                availability.</p>
                """.formatted(escape(hotelName)),
                null);
        send(toEmail, "Hotel Registration - Your Application Is Under Review", body, "registration");
    }

    @Async
    public void sendHotelApprovalEmail(String toEmail, String hotelName) {
        String body = wrapCorporateTemplate(
                "Your Application Has Been Approved",
                """
                <p>Hello,</p>
                <p>Your hotel registration for <strong>%s</strong> has been approved by our agency.</p>
                <p>You can now log in to the hotel management panel using the email address and password
                you set during registration to enter your room types, rates, availability calendar, and the
                services you offer.</p>
                """.formatted(escape(hotelName)),
                new CallToAction("Log In to Panel", frontendUrl + "/login"));
        send(toEmail, "Hotel Registration - Your Application Has Been Approved", body, "approval");
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        String body = wrapCorporateTemplate(
                "Password Reset Request",
                """
                <p>Hello,</p>
                <p>We received a password reset request for your account. You can click the button below to
                set a new password. This link is valid for 30 minutes.</p>
                <p>If you did not make this request, you can disregard this email; your password will not
                be changed.</p>
                """,
                new CallToAction("Reset Password", resetLink));
        send(toEmail, "Password Reset Request", body, "password reset");
    }

    @Async
    public void sendAdminNewHotelNotification(
            String adminEmail, String hotelName, String contactPerson, String hotelEmail, String phone) {
        String body = wrapCorporateTemplate(
                "New Hotel Application",
                """
                <p>Hello,</p>
                <p>A new hotel has registered in the system and is awaiting your approval.</p>
                <table style="width:100%%;border-collapse:collapse;margin:16px 0;">
                  <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Hotel Name</td><td style="padding:6px 0;font-weight:600;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Contact Person</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;">%s</td></tr>
                </table>
                <p>You can log in to the admin panel to review and approve or reject the application.</p>
                """.formatted(escape(hotelName), escape(contactPerson), escape(hotelEmail), escape(phone)),
                new CallToAction("Review Application", frontendUrl + "/admin/hotels"));
        send(adminEmail, "New Hotel Application - Awaiting Your Approval", body, "admin notification");
    }

    @Async
    public void sendRoomTypeCreatedEmail(String toEmail, String hotelName, String roomTypeName) {
        String body = wrapCorporateTemplate(
                "New Room Type Added",
                """
                <p>Hello,</p>
                <p>A new room type named <strong>%s</strong> has been added for <strong>%s</strong>.</p>
                """.formatted(escape(roomTypeName), escape(hotelName)),
                new CallToAction("Log In to Panel", frontendUrl + "/login"));
        send(toEmail, "New Room Type Added - " + hotelName, body, "room type created");
    }

    @Async
    public void sendNewReservationEmail(
            String toEmail,
            String hotelName,
            String reservationNumber,
            String roomTypeName,
            String customerName,
            String checkIn,
            String checkOut) {
        String body = wrapCorporateTemplate(
                "New Reservation",
                """
                <p>Hello,</p>
                <p>A new reservation has been created for <strong>%s</strong>.</p>
                <table style="width:100%%;border-collapse:collapse;margin:16px 0;">
                  <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Reservation No</td><td style="padding:6px 0;font-weight:600;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Room Type</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Guest</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Check-in</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Check-out</td><td style="padding:6px 0;">%s</td></tr>
                </table>
                """.formatted(
                        escape(hotelName),
                        escape(reservationNumber),
                        escape(roomTypeName),
                        escape(customerName),
                        escape(checkIn),
                        escape(checkOut)),
                new CallToAction("Log In to Panel", frontendUrl + "/login"));
        send(toEmail, "New Reservation - " + reservationNumber, body, "new reservation");
    }

    @Async
    public void sendReservationConfirmedEmail(
            String toEmail,
            String hotelName,
            String reservationNumber,
            String roomTypeName,
            String customerName,
            String checkIn,
            String checkOut) {
        String body = wrapCorporateTemplate(
                "Reservation Confirmed",
                """
                <p>Hello,</p>
                <p>A reservation has been confirmed by <strong>%s</strong>.</p>
                <table style="width:100%%;border-collapse:collapse;margin:16px 0;">
                  <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Reservation No</td><td style="padding:6px 0;font-weight:600;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Room Type</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Guest</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Check-in</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Check-out</td><td style="padding:6px 0;">%s</td></tr>
                </table>
                """.formatted(
                        escape(hotelName),
                        escape(reservationNumber),
                        escape(roomTypeName),
                        escape(customerName),
                        escape(checkIn),
                        escape(checkOut)),
                new CallToAction("Log In to Panel", frontendUrl + "/login"));
        send(toEmail, "Reservation Confirmed - " + reservationNumber, body, "reservation confirmed");
    }

    @Async
    public void sendHotelSetupReminderEmail(String toEmail, String hotelName) {
        String body = wrapCorporateTemplate(
                "Complete Your Hotel Setup",
                """
                <p>Hello,</p>
                <p><strong>%s</strong> has been approved, but it looks like you haven't yet added a room
                type and nightly rate, so you can't take reservations.</p>
                <p>You can open your hotel for reservations by adding at least one room type and its
                nightly rate from the hotel management panel. You will keep receiving this reminder
                periodically until this is completed.</p>
                """.formatted(escape(hotelName)),
                new CallToAction("Log In to Panel", frontendUrl + "/login"));
        send(toEmail, "Complete Your Hotel Setup - " + hotelName, body, "setup reminder");
    }

    @Async
    public void sendHotelSetupReminderAdminNotification(String adminEmail, String hotelName) {
        String body = wrapCorporateTemplate(
                "Hotel Setup Still Not Completed",
                """
                <p>Hello,</p>
                <p><strong>%s</strong> has still not added a room type and nightly rate although some
                time has passed since approval. A reminder email has been sent to the hotel.</p>
                """.formatted(escape(hotelName)),
                new CallToAction("View Hotels", frontendUrl + "/admin/hotels"));
        send(adminEmail, "Hotel Setup Not Completed - " + hotelName, body, "setup reminder admin notice");
    }

    @Async
    public void sendSupportMessageNotification(String toEmail, String hotelName, String senderName, String messageBody) {
        String body = wrapCorporateTemplate(
                "New Support Message",
                """
                <p>Hello,</p>
                <p>A new message was sent by <strong>%s</strong> in the support chat for <strong>%s</strong>.</p>
                <div style="margin:16px 0;padding:12px 16px;border-left:3px solid %s;background:#f9fafb;
                     color:#1f2937;font-size:14px;line-height:1.6;">%s</div>
                """.formatted(escape(senderName), escape(hotelName), BRAND_SIGNAL, escape(messageBody).replace("\n", "<br/>")),
                new CallToAction("View Message", frontendUrl + "/login"));
        send(toEmail, "New Support Message - " + hotelName, body, "support message");
    }

    private record CallToAction(String label, String url) {
    }

    private record ResendEmailRequest(String from, List<String> to, String subject, String html) {
    }

    private void send(String toEmail, String subject, String htmlBody, String kind) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            System.out.println("Email service not configured. Skipping " + kind + " email to: " + toEmail);
            logAttempt(new EmailAttempt(Instant.now(), kind, toEmail, false, "RESEND_API_KEY is not set"));
            return;
        }

        try {
            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + resendApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ResendEmailRequest(fromAddress, List.of(toEmail), subject, htmlBody))
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("Sent " + kind + " email to: " + toEmail);
            logAttempt(new EmailAttempt(Instant.now(), kind, toEmail, true, null));
        } catch (RestClientResponseException e) {
            // A misconfigured provider or unreachable API must not fail the request that
            // triggered the email (e.g. hotel registration) — log and move on.
            String error = e.getStatusCode() + ": " + e.getResponseBodyAsString();
            System.err.println("Failed to send " + kind + " email: " + error);
            logAttempt(new EmailAttempt(Instant.now(), kind, toEmail, false, error));
        } catch (Exception e) {
            System.err.println("Failed to send " + kind + " email: " + e.getMessage());
            logAttempt(new EmailAttempt(Instant.now(), kind, toEmail, false, String.valueOf(e.getMessage())));
        }
    }

    private synchronized void logAttempt(EmailAttempt attempt) {
        recentAttempts.addFirst(attempt);
        while (recentAttempts.size() > MAX_LOGGED_ATTEMPTS) {
            recentAttempts.removeLast();
        }
    }

    public synchronized List<EmailAttempt> getRecentAttempts() {
        return new ArrayList<>(recentAttempts);
    }

    private String wrapCorporateTemplate(String heading, String bodyHtml, CallToAction cta) {
        String button = cta == null
                ? ""
                : """
                <div style="text-align:center;margin:28px 0 8px;">
                  <a href="%s" style="background:%s;color:%s;text-decoration:none;padding:12px 28px;
                     border-radius:6px;font-weight:700;display:inline-block;">%s</a>
                </div>
                """.formatted(cta.url(), BRAND_SIGNAL, BRAND_SIGNAL_INK, escape(cta.label()));

        return """
                <html>
                  <body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                    <table role="presentation" width="100%%" style="background:#f4f4f7;padding:32px 0;">
                      <tr>
                        <td align="center">
                          <table role="presentation" width="480" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
                            <tr>
                              <td style="background:%s;padding:24px 32px;">
                                <span style="color:%s;font-size:15px;font-weight:700;letter-spacing:2px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;">TRAVEL SITES</span>
                                <div style="color:#8b929d;font-size:12px;margin-top:4px;">Hotel Partner Portal</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:32px;color:#1f2937;font-size:15px;line-height:1.6;">
                                <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">%s</h2>
                                %s
                                %s
                              </td>
                            </tr>
                            <tr>
                              <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #eef0f3;color:#9ca3af;font-size:12px;">
                                This email was sent automatically by the Travel Sites system.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """.formatted(BRAND_BG, BRAND_SIGNAL, escape(heading), bodyHtml, button);
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
