package com.hotelagency.service;

import com.hotelagency.entity.Customer;
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
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import org.springframework.stereotype.Service;

/**
 * Renders a payment invoice for a reservation the hotel has marked as paid.
 * There is no real payment gateway in this app (guests pay the hotel directly
 * during their stay), so this documents that a payment was recorded rather
 * than a gateway-issued receipt.
 *
 * Invoices are always rendered in English — regardless of the operator's
 * chosen app language — since they go out to guests as an official document.
 */
@Service
public class InvoiceService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_TIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final Color SIGNAL = new Color(0x5a, 0x63, 0xe8);
    private static final Color MUTED = new Color(0x6b, 0x72, 0x80);
    private static final Color PANEL = new Color(0xf1, 0xf2, 0xf6);

    private static final Font BRAND_FONT = new Font(Font.HELVETICA, 16, Font.BOLD, Color.BLACK);
    private static final Font TITLE_FONT = new Font(Font.HELVETICA, 22, Font.NORMAL, Color.BLACK);
    private static final Font HEADING_FONT = new Font(Font.HELVETICA, 11, Font.BOLD);
    private static final Font BODY_FONT = new Font(Font.HELVETICA, 10);
    private static final Font MUTED_FONT = new Font(Font.HELVETICA, 9, Font.NORMAL, MUTED);
    private static final Font TABLE_HEADER_FONT = new Font(Font.HELVETICA, 9, Font.BOLD, Color.WHITE);
    private static final Font PANEL_HEADER_FONT = new Font(Font.HELVETICA, 11, Font.BOLD);
    private static final Font TOTAL_FONT = new Font(Font.HELVETICA, 12, Font.BOLD);

    /** The platform's own letterhead details — this is who every invoice is issued "From". */
    private static final String COMPANY_NAME = "Travel Sites";
    private static final String[] COMPANY_ADDRESS_LINES = {
        "204 Alano Plaza", "San Antonio, TX 78205", "United States of America",
    };
    private static final String COMPANY_EMAIL = "hello@travellsites.com";
    private static final String COMPANY_PHONE = "+1 512 318177";
    private static final String COMPANY_WEBSITE = "https://travellsites.com";

    public byte[] generate(Reservation reservation) {
        try {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            addHeader(document, reservation);
            addPartyBlocks(document, reservation);
            addProductTable(document, reservation);
            addSummary(document, reservation);
            addFooter(document);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Could not generate the invoice", e);
        }
    }

    private void addHeader(Document document, Reservation reservation) throws Exception {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(24f);
        table.setWidths(new float[] {1f, 1f});

        PdfPCell brandCell = new PdfPCell(new Phrase(COMPANY_NAME, BRAND_FONT));
        brandCell.setBorder(0);
        brandCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        table.addCell(brandCell);

        PdfPCell invoiceCell = new PdfPCell();
        invoiceCell.setBorder(0);
        invoiceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph number = new Paragraph("Invoice: " + reservation.getReservationNumber(), TITLE_FONT);
        number.setAlignment(Element.ALIGN_RIGHT);
        invoiceCell.addElement(number);

        LocalDate issuedOn = LocalDate.now();
        Paragraph issued = new Paragraph("Issued on: " + DATE_FMT.format(issuedOn), MUTED_FONT);
        issued.setAlignment(Element.ALIGN_RIGHT);
        issued.setSpacingBefore(6f);
        invoiceCell.addElement(issued);

        String paidOn = reservation.getPaidAt() == null
                ? "-"
                : DATE_FMT.format(reservation.getPaidAt().atZone(ZoneId.systemDefault()).toLocalDate());
        Paragraph paid = new Paragraph("Paid on: " + paidOn, MUTED_FONT);
        paid.setAlignment(Element.ALIGN_RIGHT);
        invoiceCell.addElement(paid);

        table.addCell(invoiceCell);
        document.add(table);
    }

    private void addPartyBlocks(Document document, Reservation reservation) throws Exception {
        Customer customer = reservation.getCustomer();

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);

        PdfPCell fromCell = new PdfPCell();
        fromCell.setBorder(0);
        fromCell.addElement(new Paragraph("From", HEADING_FONT));
        fromCell.addElement(new Paragraph(COMPANY_NAME, BODY_FONT));
        for (String line : COMPANY_ADDRESS_LINES) {
            fromCell.addElement(new Paragraph(line, BODY_FONT));
        }
        fromCell.addElement(new Paragraph(COMPANY_EMAIL, BODY_FONT));
        fromCell.addElement(new Paragraph(COMPANY_PHONE, BODY_FONT));
        fromCell.addElement(new Paragraph(COMPANY_WEBSITE, BODY_FONT));

        PdfPCell toCell = new PdfPCell();
        toCell.setBorder(0);
        toCell.addElement(new Paragraph("To", HEADING_FONT));
        toCell.addElement(new Paragraph(customer.getFirstName() + " " + customer.getLastName(), BODY_FONT));
        if (customer.getPhone() != null && !customer.getPhone().isBlank()) {
            toCell.addElement(new Paragraph(customer.getPhone(), BODY_FONT));
        }
        if (customer.getEmail() != null && !customer.getEmail().isBlank()) {
            toCell.addElement(new Paragraph(customer.getEmail(), BODY_FONT));
        }

        table.addCell(fromCell);
        table.addCell(toCell);
        document.add(table);
    }

    private void addProductTable(Document document, Reservation reservation) throws Exception {
        RoomType roomType = reservation.getRoomType();
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        String currency = reservation.getCurrency();
        BigDecimal total = money(reservation.getTotalPrice());
        BigDecimal tax = money(BigDecimal.ZERO);

        String product = roomType.getName()
                + " — "
                + DATE_FMT.format(reservation.getCheckIn())
                + " to "
                + DATE_FMT.format(reservation.getCheckOut())
                + " (" + nights + (nights == 1 ? " night" : " nights") + ")";

        PdfPTable table = new PdfPTable(new float[] {4f, 1.4f, 1.6f, 1.2f, 1.6f});
        table.setWidthPercentage(100);
        table.setSpacingAfter(20f);

        for (String heading : new String[] {"Product", "Quantity", "Unit Price", "Tax", "Total"}) {
            PdfPCell cell = new PdfPCell(new Phrase(heading, TABLE_HEADER_FONT));
            cell.setBackgroundColor(SIGNAL);
            cell.setPadding(7f);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);
        }

        addBodyCell(table, product, Element.ALIGN_LEFT);
        addBodyCell(table, "1", Element.ALIGN_CENTER);
        addBodyCell(table, formatMoney(total, currency), Element.ALIGN_RIGHT);
        addBodyCell(table, formatMoney(tax, currency), Element.ALIGN_RIGHT);
        addBodyCell(table, formatMoney(total, currency), Element.ALIGN_RIGHT);

        document.add(table);
    }

    private void addBodyCell(PdfPTable table, String text, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, BODY_FONT));
        cell.setPadding(7f);
        cell.setHorizontalAlignment(alignment);
        cell.setBorderColor(PANEL);
        table.addCell(cell);
    }

    private void addSummary(Document document, Reservation reservation) throws Exception {
        String currency = reservation.getCurrency();
        BigDecimal total = money(reservation.getTotalPrice());
        BigDecimal tax = money(BigDecimal.ZERO);
        BigDecimal subtotal = total.subtract(tax);

        PdfPTable outer = new PdfPTable(2);
        outer.setWidthPercentage(100);
        outer.setSpacingAfter(28f);
        outer.setWidths(new float[] {1f, 1f});

        PdfPCell spacer = new PdfPCell();
        spacer.setBorder(0);
        outer.addCell(spacer);

        PdfPTable summary = new PdfPTable(2);
        summary.setWidthPercentage(100);

        PdfPCell header = new PdfPCell(new Phrase("Invoice Summary", PANEL_HEADER_FONT));
        header.setColspan(2);
        header.setBackgroundColor(PANEL);
        header.setPadding(8f);
        header.setBorder(0);
        summary.addCell(header);

        addSummaryRow(summary, "Subtotal", formatMoney(subtotal, currency), false);
        addSummaryRow(summary, "Tax", formatMoney(tax, currency), false);
        addSummaryRow(summary, "Total", formatMoney(total, currency), true);

        PdfPCell summaryCell = new PdfPCell(summary);
        summaryCell.setBorder(0);
        outer.addCell(summaryCell);

        document.add(outer);
    }

    private void addSummaryRow(PdfPTable table, String label, String value, boolean bold) {
        Font font = bold ? TOTAL_FONT : BODY_FONT;
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setBorder(0);
        labelCell.setPadding(6f);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBorder(0);
        valueCell.setPadding(6f);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(valueCell);
    }

    private void addFooter(Document document) throws Exception {
        Paragraph note = new Paragraph(
                "This document confirms that payment for this reservation was recorded through the "
                        + "Travel Sites booking system.",
                MUTED_FONT);
        note.setSpacingAfter(4f);
        document.add(note);

        Paragraph generated = new Paragraph(
                "Generated on: " + DATE_TIME_FMT.format(java.time.Instant.now().atZone(ZoneId.systemDefault())),
                MUTED_FONT);
        document.add(generated);
    }

    private static BigDecimal money(BigDecimal amount) {
        return (amount == null ? BigDecimal.ZERO : amount).setScale(2, RoundingMode.HALF_UP);
    }

    private static String formatMoney(BigDecimal amount, String currency) {
        return amount.toPlainString() + " " + currency;
    }
}
