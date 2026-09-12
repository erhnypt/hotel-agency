import { apiClient } from './client'
import type { PublicHotelResponse, RoomTypeResponse } from './types'

/** Public — real, active, setup-complete hotels for the landing-page search. No auth. */
export async function listPublicHotels(): Promise<PublicHotelResponse[]> {
  const response = await apiClient.get<PublicHotelResponse[]>('/public/hotels')
  return response.data
}

/** Public — a real hotel's bookable (priced) room types, for the landing-page room step. No auth. */
export async function listPublicHotelRooms(hotelId: number): Promise<RoomTypeResponse[]> {
  const response = await apiClient.get<RoomTypeResponse[]>(`/public/hotels/${hotelId}/rooms`)
  return response.data
}
