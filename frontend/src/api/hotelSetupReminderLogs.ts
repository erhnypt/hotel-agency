import { apiClient } from './client'
import type { HotelSetupReminderLogResponse, IncompleteHotelSetupResponse } from './types'

export async function listHotelSetupReminderLogs(): Promise<HotelSetupReminderLogResponse[]> {
  const response = await apiClient.get<HotelSetupReminderLogResponse[]>('/admin/hotel-setup-reminder-logs')
  return response.data
}

export async function listIncompleteHotels(): Promise<IncompleteHotelSetupResponse[]> {
  const response = await apiClient.get<IncompleteHotelSetupResponse[]>(
    '/admin/hotel-setup-reminder-logs/incomplete-hotels',
  )
  return response.data
}

export async function sendManualSetupReminder(hotelId: number): Promise<void> {
  await apiClient.post(`/admin/hotel-setup-reminder-logs/incomplete-hotels/${hotelId}/send`)
}
