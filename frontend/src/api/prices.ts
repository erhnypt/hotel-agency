import { apiClient } from './client'
import type { RoomPriceRequest, RoomPriceResponse } from './types'

export async function getPrice(roomTypeId: number): Promise<RoomPriceResponse> {
  const response = await apiClient.get<RoomPriceResponse>(`/rooms/${roomTypeId}/price`)
  return response.data
}

export async function setPrice(roomTypeId: number, request: RoomPriceRequest): Promise<RoomPriceResponse> {
  const response = await apiClient.put<RoomPriceResponse>(`/rooms/${roomTypeId}/price`, request)
  return response.data
}
