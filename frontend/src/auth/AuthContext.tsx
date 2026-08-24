import axios from 'axios'
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { apiClient } from '../api/client'
import { onUnauthorized } from './authEvents'
import { clearAuth, loadAuth, saveAuth, type StoredAuth } from './storage'
import type { ApiErrorResponse, AuthResponse, LoginRequest, UserSummary } from './types'

export interface AuthContextValue {
  user: UserSummary | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<UserSummary>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => loadAuth())

  useEffect(() => onUnauthorized(() => setAuth(null)), [])

  const login = async (email: string, password: string): Promise<UserSummary> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      } satisfies LoginRequest)
      const stored: StoredAuth = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      }
      saveAuth(stored)
      setAuth(stored)
      return stored.user
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.')
    }
  }

  const logout = () => {
    clearAuth()
    setAuth(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      isAuthenticated: auth !== null,
      login,
      logout,
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
