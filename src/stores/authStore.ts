import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { apiClient, setUnauthorizedHandler } from '@/services/apiClient'
import type {
  AuthUser,
  LoginApiUser,
  LoginCredentials,
  LoginResponse,
  UserRole,
} from '@/types/auth'

const TOKEN_KEY = 'access_token'
const USER_KEY = 'auth_user'

function readStoredUser(): AuthUser | null {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? (JSON.parse(value) as AuthUser) : null
  } catch {
    return null
  }
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function normalizeRole(role?: string): UserRole {
  switch (role?.toLowerCase()) {
    case 'admin':
    case 'administrator':
      return 'ADMIN'
    case 'hr':
    case 'human_resources':
      return 'HR'
    default:
      return 'EMPLOYEE'
  }
}

function normalizeUser(user: AuthUser | LoginApiUser, fallbackRole?: string): AuthUser | null {
  const id = user.id ?? ('user_id' in user ? user.user_id : undefined)

  if (id === undefined || !user.name || !user.email) {
    return null
  }

  const role = 'role' in user ? user.role : undefined
  const userRole = 'user_role' in user ? user.user_role : undefined

  return {
    id,
    name: user.name,
    email: user.email,
    role: normalizeRole(role ?? userRole ?? fallbackRole),
  }
}

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const token = ref<string | null>(readStoredToken())
  const user = ref<AuthUser | null>(readStoredUser())
  const loading = ref(false)

  // GETTERS
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  const role = computed<UserRole | null>(() => user.value?.role ?? null)

  // INTERNAL HELPER
  function persistAuth() {
    if (token.value) {
      localStorage.setItem(TOKEN_KEY, token.value)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }

    if (user.value) {
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }

  function clearAuth() {
    token.value = null
    user.value = null
    persistAuth()
  }

  setUnauthorizedHandler(() => {
    clearAuth()
    delete apiClient.defaults.headers.common.Authorization
  })

  // ACTION: LOGIN
  async function login(credentials: LoginCredentials) {
    loading.value = true

    try {
      const response = await apiClient.post<LoginResponse>('/login', credentials)

      const result = response.data
      const payload = result.data ?? result
      const accessToken = payload.access_token

      if (!accessToken) {
        throw new Error('The login response did not include an access token.')
      }

      token.value = accessToken

      // Ensure subsequent requests use the new token.
      apiClient.defaults.headers.common.Authorization = `Bearer ${result.access_token}`

      user.value = payload.user
        ? normalizeUser(payload.user, payload.role ?? result.role)
        : null

      persistAuth()

      // If login doesn't return the user, request it separately.
      if (!user.value) {
        await fetchUser()
      }

      return user.value
    } catch (error: unknown) {
      clearAuth()
      delete apiClient.defaults.headers.common.Authorization
      throw error
    } finally {
      loading.value = false
    }
  }

  // ACTION: FETCH CURRENT USER
  async function fetchUser() {
    if (!token.value) {
      user.value = null
      persistAuth()
      return null
    }

    try {
      const response = await apiClient.get<AuthUser>('/user')
      user.value = response.data
      persistAuth()
      return user.value
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearAuth()
        delete apiClient.defaults.headers.common.Authorization
      }

      throw error
    }
  }

  // ACTION: LOGOUT
  async function logout() {
    const currentToken = token.value
    clearAuth()
    delete apiClient.defaults.headers.common.Authorization

    if (!currentToken) return

    try {
      await apiClient.post('/logout', undefined, {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
    } catch (error: unknown) {
      // Local logout should still work if the API is unreachable.
      console.error('Server logout failed', error)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    role,
    loading,
    login,
    logout,
    fetchUser,
  }
})
