import { apiClient } from './client'
import type { SupportMessageResponse } from './types'

export async function listSupportMessages(hotelId: number): Promise<SupportMessageResponse[]> {
  const response = await apiClient.get<SupportMessageResponse[]>(`/hotels/${hotelId}/support-messages`)
  return response.data
}

export async function sendSupportMessage(hotelId: number, body: string): Promise<SupportMessageResponse> {
  const response = await apiClient.post<SupportMessageResponse>(`/hotels/${hotelId}/support-messages`, { body })
  return response.data
}
