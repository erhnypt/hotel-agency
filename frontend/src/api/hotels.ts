import { apiClient } from './client'
import type { HotelNotesResponse, HotelResponse, HotelUpdateRequest, RoomTypeResponse } from './types'

export async function listHotels(): Promise<HotelResponse[]> {
  const response = await apiClient.get<HotelResponse[]>('/hotels')
  return response.data
}

export async function getMyHotel(): Promise<HotelResponse> {
  const response = await apiClient.get<HotelResponse>('/hotels/me')
  return response.data
}

export async function getHotel(id: number): Promise<HotelResponse> {
  const response = await apiClient.get<HotelResponse>(`/hotels/${id}`)
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

export async function deactivateHotel(id: number): Promise<HotelResponse> {
  const response = await apiClient.post<HotelResponse>(`/hotels/${id}/deactivate`)
  return response.data
}

export async function reactivateHotel(id: number): Promise<HotelResponse> {
  const response = await apiClient.post<HotelResponse>(`/hotels/${id}/reactivate`)
  return response.data
}

export async function deleteHotel(id: number): Promise<void> {
  await apiClient.delete(`/hotels/${id}`)
}

export async function getHotelNotes(id: number): Promise<HotelNotesResponse> {
  const response = await apiClient.get<HotelNotesResponse>(`/hotels/${id}/notes`)
  return response.data
}

export async function updateHotelNotes(id: number, adminNotes: string | null): Promise<HotelNotesResponse> {
  const response = await apiClient.put<HotelNotesResponse>(`/hotels/${id}/notes`, { adminNotes })
  return response.data
}
