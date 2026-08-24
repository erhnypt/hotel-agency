import { apiClient } from './client'
import type { UpdateProfileRequest } from './types'

export interface UserSummary {
  id: number
  email: string
  fullName: string
  role: string
}

export const getProfile = () =>
  apiClient.get<UserSummary>('/auth/me').then((r) => r.data)

export const updateProfile = (request: UpdateProfileRequest) =>
  apiClient.put<UserSummary>('/auth/me', request).then((r) => r.data)
