import { apiClient } from './client'

export const requestPasswordReset = (email: string) =>
  apiClient.post<void>('/auth/forgot-password', { email }).then(() => undefined)

export const resetPassword = (token: string, newPassword: string) =>
  apiClient.post<void>('/auth/reset-password', { token, newPassword }).then(() => undefined)
