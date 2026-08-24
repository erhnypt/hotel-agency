import { apiClient } from './client'
import type { CustomerRequest, CustomerResponse } from './types'

export async function listCustomers(): Promise<CustomerResponse[]> {
  const response = await apiClient.get<CustomerResponse[]>('/customers')
  return response.data
}

export async function createCustomer(request: CustomerRequest): Promise<CustomerResponse> {
  const response = await apiClient.post<CustomerResponse>('/customers', request)
  return response.data
}

export async function updateCustomer(id: number, request: CustomerRequest): Promise<CustomerResponse> {
  const response = await apiClient.put<CustomerResponse>(`/customers/${id}`, request)
  return response.data
}
