export type RoleName = 'AGENCY_ADMIN' | 'AGENCY_STAFF' | 'HOTEL_ADMIN'

export interface UserSummary {
  id: number
  email: string
  fullName: string
  role: RoleName
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresInMs: number
  user: UserSummary
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  fieldErrors?: Record<string, string>
}
