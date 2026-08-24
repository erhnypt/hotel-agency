import { apiClient } from './client'
import type { RoomTypeRequest, RoomTypeResponse } from './types'

export async function createRoomType(hotelId: number, request: RoomTypeRequest): Promise<RoomTypeResponse> {
  const response = await apiClient.post<RoomTypeResponse>(`/hotels/${hotelId}/rooms`, request)
  return response.data
}

export async function updateRoomType(id: number, request: RoomTypeRequest): Promise<RoomTypeResponse> {
  const response = await apiClient.put<RoomTypeResponse>(`/rooms/${id}`, request)
  return response.data
}

export async function deleteRoomType(id: number): Promise<void> {
  await apiClient.delete(`/rooms/${id}`)
}

export async function addRoomImage(roomTypeId: number, imageUrl: string): Promise<void> {
  await apiClient.post(`/rooms/${roomTypeId}/images`, { imageUrl })
}

export async function deleteRoomImage(imageId: number): Promise<void> {
  await apiClient.delete(`/room-images/${imageId}`)
}
