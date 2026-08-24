package com.hotelagency.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendHotelRegistrationEmail(String toEmail, String hotelName) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Skipping email to: " + toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Otel Kaydı - Başvurunuz İnceleniyor");
            helper.setText(buildRegistrationEmailBody(hotelName), true);

            mailSender.send(message);
            System.out.println("Registration email sent to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Failed to send registration email: " + e.getMessage());
        }
    }

    public void sendHotelApprovalEmail(String toEmail, String hotelName) {
        if (mailSender == null) {
            System.out.println("Email service not configured. Skipping approval email to: " + toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Otel Kaydı - Başvurunuz Onaylandı");
            helper.setText(buildApprovalEmailBody(hotelName), true);

            mailSender.send(message);
            System.out.println("Approval email sent to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Failed to send approval email: " + e.getMessage());
        }
    }

    private String buildRegistrationEmailBody(String hotelName) {
        return String.format("""
                <html>
                  <body>
                    <h2>Otel Kaydı Başarılı</h2>
                    <p>Merhaba,</p>
                    <p><strong>%s</strong> otelinin kaydı başarıyla alınmıştır.</p>
                    <p>Başvurunuz şu anda acentemiz tarafından incelenmektedir. Onay sürecinde size email ile bilgi verilecektir.</p>
                    <p>Sorularınız için bize ulaşabilirsiniz.</p>
                    <p>Saygılarımızla,<br>Hotel Reservation Agency</p>
                  </body>
                </html>
                """, hotelName);
    }

    private String buildApprovalEmailBody(String hotelName) {
        return String.format("""
                <html>
                  <body>
                    <h2>Otel Kaydı Onaylandı</h2>
                    <p>Merhaba,</p>
                    <p><strong>%s</strong> otelinin kaydı acentemiz tarafından onaylanmıştır.</p>
                    <p>Artık otel yönetim paneline erişebilir ve otel detaylarını (oda tipleri, fiyatlar, müsaitlik vb.) girebilirsiniz.</p>
                    <p><a href="http://localhost:5174">Panele Giriş Yap</a></p>
                    <p>Saygılarımızla,<br>Hotel Reservation Agency</p>
                  </body>
                </html>
                """, hotelName);
    }
}
