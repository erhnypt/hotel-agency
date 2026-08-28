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
                "Başvurunuz Alındı",
                """
                <p>Merhaba,</p>
                <p><strong>%s</strong> için otel kaydınız başarıyla alınmıştır.</p>
                <p>Başvurunuz şu anda acente ekibimiz tarafından incelenmektedir. İnceleme tamamlandığında
                onay durumu hakkında size ayrıca bilgilendirme e-postası gönderilecektir.</p>
                <p>Onay sürecinin ardından, kayıt sırasında belirlediğiniz e-posta ve şifre ile otel yönetim
                panelinize giriş yaparak oda tipleri, fiyatlar ve müsaitlik bilgilerinizi girebileceksiniz.</p>
                """.formatted(escape(hotelName)),
                null);
        send(toEmail, "Otel Kaydı - Başvurunuz İnceleniyor", body, "registration");
    }

    @Async
    public void sendHotelApprovalEmail(String toEmail, String hotelName) {
        String body = wrapCorporateTemplate(
                "Başvurunuz Onaylandı",
                """
                <p>Merhaba,</p>
                <p><strong>%s</strong> için yapmış olduğunuz otel kaydı acentemiz tarafından onaylanmıştır.</p>
                <p>Artık kayıt sırasında belirlediğiniz e-posta adresi ve şifre ile otel yönetim panelinize
                giriş yapabilir; oda tiplerinizi, fiyatlarınızı, müsaitlik takviminizi ve sunduğunuz hizmetleri
                girebilirsiniz.</p>
                """.formatted(escape(hotelName)),
                new CallToAction("Panele Giriş Yap", frontendUrl + "/login"));
        send(toEmail, "Otel Kaydı - Başvurunuz Onaylandı", body, "approval");
    }

    @Async
    public void sendAdminNewHotelNotification(
            String adminEmail, String hotelName, String contactPerson, String hotelEmail, String phone) {
        String body = wrapCorporateTemplate(
                "Yeni Otel Başvurusu",
                """
                <p>Merhaba,</p>
                <p>Sisteme yeni bir otel kaydı yapıldı ve onayınızı bekliyor.</p>
                <table style="width:100%%;border-collapse:collapse;margin:16px 0;">
                  <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Otel Adı</td><td style="padding:6px 0;font-weight:600;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">İletişim Kişisi</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">E-posta</td><td style="padding:6px 0;">%s</td></tr>
                  <tr><td style="padding:6px 0;color:#6b7280;">Telefon</td><td style="padding:6px 0;">%s</td></tr>
                </table>
                <p>Başvuruyu incelemek ve onaylamak/reddetmek için yönetim paneline giriş yapabilirsiniz.</p>
                """.formatted(escape(hotelName), escape(contactPerson), escape(hotelEmail), escape(phone)),
                new CallToAction("Başvuruyu İncele", frontendUrl + "/admin/hotels"));
        send(adminEmail, "Yeni Otel Başvurusu - Onayınızı Bekliyor", body, "admin notification");
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
                                <div style="color:#8b929d;font-size:12px;margin-top:4px;">Otel Acentesi Merkezi</div>
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
                                Bu e-posta Travel Sites sistemi tarafından otomatik olarak gönderilmiştir.
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
