package com.hotelagency.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hotelagency.dto.customer.CustomerRequest;
import com.hotelagency.dto.customer.CustomerResponse;
import com.hotelagency.entity.Customer;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.CustomerRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(customerRepository);
    }

    private CustomerRequest sampleRequest() {
        return new CustomerRequest("John", "Smith", "+1 555 000", "john@example.com", "P1234567", "US", "VIP guest", "John Smith", "VISA", "4242", "12/29");
    }

    @Test
    void createSavesCustomer() {
        CustomerResponse response = customerService.create(sampleRequest());

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        Customer saved = captor.getValue();
        assertThat(saved.getFirstName()).isEqualTo("John");
        assertThat(saved.getLastName()).isEqualTo("Smith");
        assertThat(saved.getEmail()).isEqualTo("john@example.com");
        assertThat(saved.getCardBrand()).isEqualTo("VISA");
        assertThat(saved.getCardLast4()).isEqualTo("4242");
        assertThat(saved.getCardExpiry()).isEqualTo("12/29");
        assertThat(response.firstName()).isEqualTo("John");
        assertThat(response.cardLast4()).isEqualTo("4242");
    }

    @Test
    void findAllReturnsAllCustomers() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setFirstName("John");
        customer.setLastName("Smith");
        when(customerRepository.findAll()).thenReturn(List.of(customer));

        List<CustomerResponse> result = customerService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).firstName()).isEqualTo("John");
    }

    @Test
    void findByIdThrowsWhenMissing() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.findById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateModifiesExistingCustomer() {
        Customer customer = new Customer();
        customer.setId(1L);
        customer.setFirstName("John");
        customer.setLastName("Smith");
        customer.setPhone("+1 555 000");
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        CustomerResponse response = customerService.update(
                1L, new CustomerRequest("Jonathan", "Smith", "+1 555 111", null, null, null, "Updated notes", null, null, null, null));

        assertThat(response.firstName()).isEqualTo("Jonathan");
        assertThat(response.phone()).isEqualTo("+1 555 111");
        assertThat(response.notes()).isEqualTo("Updated notes");
    }

    @Test
    void updateThrowsWhenCustomerMissing() {
        when(customerRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.update(99L, sampleRequest()))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
