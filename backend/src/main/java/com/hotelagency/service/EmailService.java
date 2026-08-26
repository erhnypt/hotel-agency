package com.hotelagency.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final String BRAND_BG = "#0a0b0d";
    private static final String BRAND_SIGNAL = "#ffb238";
    private static final String BRAND_SIGNAL_INK = "#1a1200";

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

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

    private void send(String toEmail, String subject, String htmlBody, String kind) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Skipping " + kind + " email to: " + toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            System.out.println("Sent " + kind + " email to: " + toEmail);
        } catch (Exception e) {
            // A misconfigured or unreachable SMTP server must not fail the request that
            // triggered the email (e.g. hotel registration) — log and move on.
            System.err.println("Failed to send " + kind + " email: " + e.getMessage());
        }
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
                                <span style="color:%s;font-size:15px;font-weight:700;letter-spacing:2px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;">SANTRAL</span>
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
                                Bu e-posta Santral sistemi tarafından otomatik olarak gönderilmiştir.
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
