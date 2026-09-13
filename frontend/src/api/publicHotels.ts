import { apiClient } from './client'
import type { PublicHotelResponse, RoomTypeResponse } from './types'

/**
 * The backend can be cold (Render free-tier spin-down), which can take up to
 * ~60s to wake. Neither caller blocks the initial page render on this (see
 * `loadRealHotels` in data/catalog.ts and the room-step spinner in
 * LandingPage.tsx), so it's safe to wait out a full cold start rather than
 * give up early and silently drop real hotels for that session.
 */
const PUBLIC_REQUEST_TIMEOUT_MS = 60_000

/** Public — real, active, setup-complete hotels for the landing-page search. No auth. */
export async function listPublicHotels(): Promise<PublicHotelResponse[]> {
  const response = await apiClient.get<PublicHotelResponse[]>('/public/hotels', {
    timeout: PUBLIC_REQUEST_TIMEOUT_MS,
  })
  return response.data
}

/** Public — a real hotel's bookable (priced) room types, for the landing-page room step. No auth. */
export async function listPublicHotelRooms(hotelId: number): Promise<RoomTypeResponse[]> {
  const response = await apiClient.get<RoomTypeResponse[]>(`/public/hotels/${hotelId}/rooms`, {
    timeout: PUBLIC_REQUEST_TIMEOUT_MS,
  })
  return response.data
}
