package com.hotelagency.service;

import com.hotelagency.dto.customer.CustomerRequest;
import com.hotelagency.dto.customer.CustomerResponse;
import com.hotelagency.entity.Customer;
import com.hotelagency.exception.ResourceNotFoundException;
import com.hotelagency.repository.CustomerRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        return CustomerResponse.from(createEntity(request));
    }

    /**
     * Creates and persists a customer, returning the entity itself rather than a DTO.
     * Used by {@code ReservationService} when a reservation is created for a new customer.
     */
    @Transactional
    public Customer createEntity(CustomerRequest request) {
        Customer customer = new Customer();
        applyRequest(customer, request);
        customerRepository.save(customer);
        return customer;
    }

    public List<CustomerResponse> findAll() {
        return customerRepository.findAll().stream().map(CustomerResponse::from).toList();
    }

    public CustomerResponse findById(Long id) {
        return CustomerResponse.from(getCustomerOrThrow(id));
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = getCustomerOrThrow(id);
        applyRequest(customer, request);

        return CustomerResponse.from(customer);
    }

    private void applyRequest(Customer customer, CustomerRequest request) {
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setPhone(request.phone());
        customer.setEmail(request.email());
        customer.setPassportNumber(request.passportNumber());
        customer.setNationality(request.nationality());
        customer.setNotes(request.notes());
    }

    private Customer getCustomerOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }
}
