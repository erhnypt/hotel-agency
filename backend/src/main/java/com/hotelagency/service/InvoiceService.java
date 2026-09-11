package com.hotelagency.service;

import com.hotelagency.entity.Customer;
import com.hotelagency.entity.Hotel;
import com.hotelagency.entity.Reservation;
import com.hotelagency.entity.RoomType;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import org.springframework.stereotype.Service;

/**
 * Renders a payment invoice for a reservation the hotel has marked as paid.
 * There is no real payment gateway in this app (guests pay the hotel directly
 * during their stay), so this documents that a payment was recorded rather
 * than a gateway-issued receipt.
 */
@Service
public class InvoiceService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final DateTimeFormatter DATE_TIME_FMT = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
    private static final Color SIGNAL = new Color(0x5a, 0x63, 0xe8);
    private static final Color MUTED = new Color(0x6b, 0x72, 0x80);

    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 20, Font.BOLD, SIGNAL);
    private static final Font HEADING_FONT = new Font(Font.HELVETICA, 11, Font.BOLD);
    private static final Font BODY_FONT = new Font(Font.HELVETICA, 10);
    private static final Font MUTED_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL, MUTED);
    private static final Font TABLE_HEADER_FONT = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
    private static final Font TOTAL_FONT = new Font(Font.HELVETICA, 13, Font.BOLD);

    public byte[] generate(Reservation reservation) {
        try {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            addHeader(document, reservation);
            addPartyBlocks(document, reservation);
            addStayTable(document, reservation);
            addTotal(document, reservation);
            addFooter(document, reservation);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Fatura oluşturulamadı", e);
        }
    }

    private void addHeader(Document document, Reservation reservation) throws Exception {
        Paragraph title = new Paragraph("FATURA", TITLE_FONT);
        document.add(title);

        Paragraph number = new Paragraph("Rezervasyon No: " + reservation.getReservationNumber(), BODY_FONT);
        number.setSpacingAfter(2f);
        document.add(number);

        String paidAt = reservation.getPaidAt() == null
                ? "-"
                : DATE_TIME_FMT.format(reservation.getPaidAt().atZone(ZoneId.systemDefault()));
        Paragraph date = new Paragraph("Ödeme Tarihi: " + paidAt, BODY_FONT);
        date.setSpacingAfter(16f);
        document.add(date);
    }

    private void addPartyBlocks(Document document, Reservation reservation) throws Exception {
        Hotel hotel = reservation.getHotel();
        Customer customer = reservation.getCustomer();

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);

        PdfPCell sellerCell = new PdfPCell();
        sellerCell.setBorder(0);
        sellerCell.addElement(new Paragraph("SATICI", HEADING_FONT));
        sellerCell.addElement(new Paragraph(hotel.getName(), BODY_FONT));
        sellerCell.addElement(new Paragraph(hotel.getAddress(), BODY_FONT));
        sellerCell.addElement(new Paragraph(hotel.getCity() + ", " + hotel.getCountry(), BODY_FONT));
        sellerCell.addElement(new Paragraph(hotel.getPhone(), BODY_FONT));
        sellerCell.addElement(new Paragraph(hotel.getEmail(), BODY_FONT));

        PdfPCell buyerCell = new PdfPCell();
        buyerCell.setBorder(0);
        buyerCell.addElement(new Paragraph("MÜŞTERİ", HEADING_FONT));
        buyerCell.addElement(new Paragraph(customer.getFirstName() + " " + customer.getLastName(), BODY_FONT));
        buyerCell.addElement(new Paragraph(customer.getPhone(), BODY_FONT));
        if (customer.getEmail() != null && !customer.getEmail().isBlank()) {
            buyerCell.addElement(new Paragraph(customer.getEmail(), BODY_FONT));
        }

        table.addCell(sellerCell);
        table.addCell(buyerCell);
        document.add(table);
    }

    private void addStayTable(Document document, Reservation reservation) throws Exception {
        RoomType roomType = reservation.getRoomType();
        long nights = java.time.temporal.ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());

        PdfPTable table = new PdfPTable(new float[] {3f, 2f, 2f, 1f, 1f, 2f});
        table.setWidthPercentage(100);
        table.setSpacingAfter(16f);

        for (String heading : new String[] {"Oda Tipi", "Giriş", "Çıkış", "Gece", "Misafir", "Tutar"}) {
            PdfPCell cell = new PdfPCell(new Phrase(heading, TABLE_HEADER_FONT));
            cell.setBackgroundColor(SIGNAL);
            cell.setPadding(6f);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        addBodyCell(table, roomType.getName(), Element.ALIGN_LEFT);
        addBodyCell(table, DATE_FMT.format(reservation.getCheckIn()), Element.ALIGN_CENTER);
        addBodyCell(table, DATE_FMT.format(reservation.getCheckOut()), Element.ALIGN_CENTER);
        addBodyCell(table, String.valueOf(nights), Element.ALIGN_CENTER);
        addBodyCell(table, String.valueOf(reservation.getGuests()), Element.ALIGN_CENTER);
        addBodyCell(table, reservation.getTotalPrice() + " " + reservation.getCurrency(), Element.ALIGN_RIGHT);

        document.add(table);
    }

    private void addBodyCell(PdfPTable table, String text, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, BODY_FONT));
        cell.setPadding(6f);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
    }

    private void addTotal(Document document, Reservation reservation) throws Exception {
        Paragraph total = new Paragraph(
                "Ödenen Tutar: " + reservation.getTotalPrice() + " " + reservation.getCurrency(), TOTAL_FONT);
        total.setAlignment(Element.ALIGN_RIGHT);
        total.setSpacingAfter(28f);
        document.add(total);
    }

    private void addFooter(Document document, Reservation reservation) throws Exception {
        Paragraph note = new Paragraph(
                "Bu belge, rezervasyon için otele yapılan ödemenin Travel Sites rezervasyon sistemi üzerinden "
                        + "kaydedildiğini gösterir.",
                MUTED_FONT);
        note.setSpacingAfter(4f);
        document.add(note);

        Paragraph generated = new Paragraph(
                "Oluşturulma: " + DATE_TIME_FMT.format(java.time.Instant.now().atZone(ZoneId.systemDefault())),
                MUTED_FONT);
        document.add(generated);
    }
}
