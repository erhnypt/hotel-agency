import { apiClient } from './client'
import type { StaffRequest, StaffResponse } from './types'

export const listStaff = () =>
  apiClient.get<StaffResponse[]>('/staff').then((r) => r.data)

export const createStaff = (request: StaffRequest) =>
  apiClient.post<StaffResponse>('/staff', request).then((r) => r.data)

export const deleteStaff = (id: number) =>
  apiClient.delete(`/staff/${id}`)
