package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.bookingrequest.BookingRequestCreateRequest;
import com.hotelagency.dto.bookingrequest.BookingRequestResponse;
import com.hotelagency.entity.BookingRequest;
import com.hotelagency.entity.BookingRequestStatus;
import com.hotelagency.exception.InvalidReservationException;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.BookingRequestRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BookingRequestServiceTest {

    @Mock
    private BookingRequestRepository repository;

    private BookingRequestService service;

    @BeforeEach
    void setUp() {
        service = new BookingRequestService(repository);
    }

    private BookingRequestCreateRequest sampleRequest() {
        return new BookingRequestCreateRequest(
                "city-hotel", "Cassidy City Hotel", "City", "PRT", "Portugal",
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 13), 2,
                "Jane Doe", "jane@example.com", "+351 555 111", "  Late arrival  ");
    }

    @Test
    void createPersistsANewRequestWithTrimmedFieldsAndNewStatus() {
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        BookingRequestResponse response = service.create(sampleRequest());

        ArgumentCaptor<BookingRequest> captor = ArgumentCaptor.forClass(BookingRequest.class);
        verify(repository).save(captor.capture());
        BookingRequest saved = captor.getValue();
        assertThat(saved.getStatus()).isEqualTo(BookingRequestStatus.NEW);
        assertThat(saved.getMessage()).isEqualTo("Late arrival");
        assertThat(saved.getPropertyName()).isEqualTo("Cassidy City Hotel");
        assertThat(response.status()).isEqualTo(BookingRequestStatus.NEW);
        assertThat(response.contactEmail()).isEqualTo("jane@example.com");
    }

    @Test
    void createRejectsWhenCheckOutNotAfterCheckIn() {
        BookingRequestCreateRequest bad = new BookingRequestCreateRequest(
                "city-hotel", "Cassidy City Hotel", "City", null, null,
                LocalDate.of(2026, 9, 13), LocalDate.of(2026, 9, 13), 2,
                "Jane Doe", "jane@example.com", "+351 555 111", null);

        assertThatThrownBy(() -> service.create(bad)).isInstanceOf(InvalidReservationException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void createBlanksOptionalCountryToNull() {
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        BookingRequestCreateRequest req = new BookingRequestCreateRequest(
                "resort-hotel", "Cassidy Resort Hotel", "Resort", "  ", "",
                LocalDate.of(2026, 9, 10), LocalDate.of(2026, 9, 12), 3,
                "A B", "a@b.com", "123", "   ");

        service.create(req);

        ArgumentCaptor<BookingRequest> captor = ArgumentCaptor.forClass(BookingRequest.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getCountryCode()).isNull();
        assertThat(captor.getValue().getCountryName()).isNull();
        assertThat(captor.getValue().getMessage()).isNull();
    }

    @Test
    void updateStatusChangesStatus() {
        BookingRequest entity = new BookingRequest();
        entity.setId(7L);
        entity.setStatus(BookingRequestStatus.NEW);
        when(repository.findById(7L)).thenReturn(Optional.of(entity));

        BookingRequestResponse response = service.updateStatus(7L, BookingRequestStatus.IN_PROGRESS);

        assertThat(response.status()).isEqualTo(BookingRequestStatus.IN_PROGRESS);
        assertThat(entity.getStatus()).isEqualTo(BookingRequestStatus.IN_PROGRESS);
    }

    @Test
    void updateStatusThrowsWhenMissing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateStatus(99L, BookingRequestStatus.CLOSED))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
