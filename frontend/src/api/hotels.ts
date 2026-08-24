import { apiClient } from './client'
import type { HotelResponse, HotelUpdateRequest, RoomTypeResponse } from './types'

export async function listHotels(): Promise<HotelResponse[]> {
  const response = await apiClient.get<HotelResponse[]>('/hotels')
  return response.data
}

export async function getMyHotel(): Promise<HotelResponse> {
  const response = await apiClient.get<HotelResponse>('/hotels/me')
  return response.data
}

export async function updateHotel(id: number, request: HotelUpdateRequest): Promise<HotelResponse> {
  const response = await apiClient.put<HotelResponse>(`/hotels/${id}`, request)
  return response.data
}

export async function listRoomTypes(hotelId: number): Promise<RoomTypeResponse[]> {
  const response = await apiClient.get<RoomTypeResponse[]>(`/hotels/${hotelId}/rooms`)
  return response.data
}

export async function approveHotel(id: number): Promise<HotelResponse> {
  const response = await apiClient.post<HotelResponse>(`/hotels/${id}/approve`)
  return response.data
}

export async function rejectHotel(id: number): Promise<HotelResponse> {
  const response = await apiClient.post<HotelResponse>(`/hotels/${id}/reject`)
  return response.data
}
