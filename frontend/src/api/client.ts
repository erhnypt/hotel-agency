import axios, { type InternalAxiosRequestConfig } from 'axios'
import { notifyUnauthorized } from '../auth/authEvents'
import { clearAuth, loadAuth, saveAuth, type StoredAuth } from '../auth/storage'
import type { AuthResponse } from '../auth/types'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'

export const apiClient = axios.create({ baseURL })

apiClient.interceptors.request.use((config) => {
  const auth = loadAuth()
  if (auth?.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`)
  }
  return config
})

/**
 * The access token is short-lived (1h) and, until now, nothing ever used the
 * refresh token that login/refresh hand back — so the first request after
 * expiry got a 401 and logged the user out mid-session (e.g. while deleting a
 * room type). Shared across concurrent 401s so a burst of requests triggers
 * only one /auth/refresh call.
 */
let refreshPromise: Promise<string | null> | null = null

function refreshAccessToken(): Promise<string | null> {
  const auth = loadAuth()
  if (!auth?.refreshToken) return Promise.resolve(null)

  if (!refreshPromise) {
    refreshPromise = axios
      .post<AuthResponse>(`${baseURL}/auth/refresh`, { refreshToken: auth.refreshToken })
      .then((response) => {
        const stored: StoredAuth = {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: response.data.user,
        }
        saveAuth(stored)
        return stored.accessToken
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined
    // Never retry the refresh call itself, and only retry a given request once.
    if (!config || config._retried || config.url?.includes('/auth/refresh')) {
      clearAuth()
      notifyUnauthorized()
      return Promise.reject(error)
    }

    const newAccessToken = await refreshAccessToken()
    if (!newAccessToken) {
      clearAuth()
      notifyUnauthorized()
      return Promise.reject(error)
    }

    config._retried = true
    return apiClient(config)
  },
)
