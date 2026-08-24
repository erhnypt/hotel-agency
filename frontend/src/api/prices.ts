import { apiClient } from './client'
import type { RoomPriceRequest, RoomPriceResponse } from './types'

export async function listPrices(roomTypeId: number): Promise<RoomPriceResponse[]> {
  const response = await apiClient.get<RoomPriceResponse[]>(`/rooms/${roomTypeId}/prices`)
  return response.data
}

export async function upsertPrice(roomTypeId: number, request: RoomPriceRequest): Promise<RoomPriceResponse> {
  const response = await apiClient.post<RoomPriceResponse>(`/rooms/${roomTypeId}/prices`, request)
  return response.data
}

export async function deletePrice(id: number): Promise<void> {
  await apiClient.delete(`/room-prices/${id}`)
}
