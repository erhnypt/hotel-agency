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

export async function getMySupportUnread(): Promise<boolean> {
  const response = await apiClient.get<{ unread: boolean }>('/hotels/me/support-unread')
  return response.data.unread
}

export async function listHotelsWithUnreadSupport(): Promise<number[]> {
  const response = await apiClient.get<number[]>('/hotels/support-unread')
  return response.data
}
