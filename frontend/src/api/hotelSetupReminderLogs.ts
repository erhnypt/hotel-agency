import { apiClient } from './client'
import type { HotelSetupReminderLogResponse } from './types'

export async function listHotelSetupReminderLogs(): Promise<HotelSetupReminderLogResponse[]> {
  const response = await apiClient.get<HotelSetupReminderLogResponse[]>('/admin/hotel-setup-reminder-logs')
  return response.data
}
