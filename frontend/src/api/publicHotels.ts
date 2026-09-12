import { apiClient } from './client'
import type { PublicHotelResponse } from './types'

/** Public — real, active, setup-complete hotels for the landing-page search. No auth. */
export async function listPublicHotels(): Promise<PublicHotelResponse[]> {
  const response = await apiClient.get<PublicHotelResponse[]>('/public/hotels')
  return response.data
}
