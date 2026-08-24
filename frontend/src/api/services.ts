import { apiClient } from './client'
import type { ServiceRequest, ServiceResponse } from './types'

export async function listServices(hotelId: number): Promise<ServiceResponse[]> {
  const response = await apiClient.get<ServiceResponse[]>(`/hotels/${hotelId}/services`)
  return response.data
}

export async function createService(hotelId: number, request: ServiceRequest): Promise<ServiceResponse> {
  const response = await apiClient.post<ServiceResponse>(`/hotels/${hotelId}/services`, request)
  return response.data
}

export async function deleteService(id: number): Promise<void> {
  await apiClient.delete(`/services/${id}`)
}
