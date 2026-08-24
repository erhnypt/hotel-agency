import { apiClient } from './client'
import type { AvailableRoomResponse, ReservationCreateRequest, ReservationResponse } from './types'

export async function listReservations(): Promise<ReservationResponse[]> {
  const response = await apiClient.get<ReservationResponse[]>('/reservations')
  return response.data
}

export async function createReservation(request: ReservationCreateRequest): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>('/reservations', request)
  return response.data
}

export async function confirmReservation(id: number): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>(`/reservations/${id}/confirm`)
  return response.data
}

export async function rejectReservation(id: number): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>(`/reservations/${id}/reject`)
  return response.data
}

export async function cancelReservation(id: number): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>(`/reservations/${id}/cancel`)
  return response.data
}

export async function searchAvailableRooms(
  hotelId: number,
  checkIn: string,
  checkOut: string,
  guests: number,
): Promise<AvailableRoomResponse[]> {
  const response = await apiClient.get<AvailableRoomResponse[]>(`/hotels/${hotelId}/available-rooms`, {
    params: { checkIn, checkOut, guests },
  })
  return response.data
}
