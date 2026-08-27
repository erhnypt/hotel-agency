import { apiClient } from './client'
import type {
  BookingRequestCreateRequest,
  BookingRequestResponse,
  BookingRequestStatus,
} from './types'

/** Public — submitted from the landing-page hotel search, no auth. */
export async function submitBookingRequest(
  body: BookingRequestCreateRequest,
): Promise<BookingRequestResponse> {
  const response = await apiClient.post<BookingRequestResponse>('/public/booking-requests', body)
  return response.data
}

export async function listBookingRequests(): Promise<BookingRequestResponse[]> {
  const response = await apiClient.get<BookingRequestResponse[]>('/booking-requests')
  return response.data
}

export async function updateBookingRequestStatus(
  id: number,
  status: BookingRequestStatus,
): Promise<BookingRequestResponse> {
  const response = await apiClient.post<BookingRequestResponse>(`/booking-requests/${id}/status`, {
    status,
  })
  return response.data
}
