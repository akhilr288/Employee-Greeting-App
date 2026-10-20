import axios from 'axios'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

let unauthorizedHandler: (() => void) | undefined

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      delete apiClient.defaults.headers.common.Authorization
      if (unauthorizedHandler) {
        unauthorizedHandler()
      } else {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }

    return Promise.reject(error)
  },
)
