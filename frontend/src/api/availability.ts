import { apiClient } from './client'
import type { RoomAvailabilityRequest, RoomAvailabilityResponse } from './types'

export async function listAvailability(roomTypeId: number): Promise<RoomAvailabilityResponse[]> {
  const response = await apiClient.get<RoomAvailabilityResponse[]>(`/rooms/${roomTypeId}/availability`)
  return response.data
}

export async function upsertAvailability(
  roomTypeId: number,
  request: RoomAvailabilityRequest,
): Promise<RoomAvailabilityResponse> {
  const response = await apiClient.post<RoomAvailabilityResponse>(`/rooms/${roomTypeId}/availability`, request)
  return response.data
}

export async function deleteAvailability(id: number): Promise<void> {
  await apiClient.delete(`/room-availability/${id}`)
}
