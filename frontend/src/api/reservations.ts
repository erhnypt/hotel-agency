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

export async function markReservationPaid(id: number): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>(`/reservations/${id}/mark-paid`)
  return response.data
}

export async function unmarkReservationPaid(id: number): Promise<ReservationResponse> {
  const response = await apiClient.post<ReservationResponse>(`/reservations/${id}/unmark-paid`)
  return response.data
}

export async function deleteReservation(id: number): Promise<void> {
  await apiClient.delete(`/reservations/${id}`)
}

export async function downloadReservationInvoice(id: number, filename: string): Promise<void> {
  const response = await apiClient.get(`/reservations/${id}/invoice`, { responseType: 'blob' })
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
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
