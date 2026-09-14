import { apiClient } from './client'
import type { CardViewLogResponse } from './types'

export async function listCardViewLogs(): Promise<CardViewLogResponse[]> {
  const response = await apiClient.get<CardViewLogResponse[]>('/admin/card-view-logs')
  return response.data
}

export async function getCardViewUnreadCount(): Promise<number> {
  const response = await apiClient.get<{ unread: number }>('/admin/card-view-logs/unread-count')
  return response.data.unread
}

export async function markCardViewLogsRead(): Promise<void> {
  await apiClient.post('/admin/card-view-logs/mark-read')
}
