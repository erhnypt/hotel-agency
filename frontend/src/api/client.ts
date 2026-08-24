import axios from 'axios'
import { notifyUnauthorized } from '../auth/authEvents'
import { clearAuth, loadAuth } from '../auth/storage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
})

apiClient.interceptors.request.use((config) => {
  const auth = loadAuth()
  if (auth?.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuth()
      notifyUnauthorized()
    }
    return Promise.reject(error)
  },
)
