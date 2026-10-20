import { AxiosError, AxiosHeaders, type AxiosAdapter } from 'axios'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/services/apiClient'
import { useAuthStore } from '@/stores/authStore'
import type { AuthUser } from '@/types/auth'
import router from '@/router'

const user: AuthUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN',
}

describe('authentication store', () => {
  beforeEach(async () => {
    localStorage.clear()
    const pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore(pinia).$patch({ token: null, user: null, loading: false })
    vi.restoreAllMocks()
    await router.push('/login')
  })

  it('clears local auth immediately on logout and protects private routes', async () => {
    const auth = useAuthStore()
    vi.spyOn(apiClient, 'post')
      .mockResolvedValueOnce({
        data: {
          data: {
            access_token: 'test-token',
            token_type: 'Bearer',
            user: {
              user_id: 'user-123',
              name: user.name,
              email: user.email,
              user_role: 'exhibitor_staff',
            },
          },
        },
      })
      .mockImplementationOnce(() => {
        expect(auth.token).toBeNull()
        expect(auth.user).toBeNull()
        expect(localStorage.getItem('access_token')).toBeNull()
        expect(localStorage.getItem('auth_user')).toBeNull()
        return Promise.resolve({ data: {} })
      })

    await auth.login({ email: user.email, password: 'valid-password' })
    expect(auth.isAuthenticated).toBe(true)

    await auth.logout()

    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()

    await router.push('/dashboard')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('clears authentication state when any API request returns 401', async () => {
    const auth = useAuthStore()
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        data: {
          access_token: 'test-token',
          token_type: 'Bearer',
          user: {
            user_id: 'user-123',
            name: user.name,
            email: user.email,
            user_role: 'exhibitor_staff',
          },
        },
      },
    })
    await auth.login({ email: user.email, password: 'valid-password' })

    const adapter: AxiosAdapter = async (config) => {
      const response = {
        data: {},
        status: 401,
        statusText: 'Unauthorized',
        headers: new AxiosHeaders(),
        config,
      }
      throw new AxiosError('Unauthorized', AxiosError.ERR_BAD_REQUEST, config, undefined, response)
    }
    apiClient.defaults.adapter = adapter

    await expect(apiClient.get('/protected-resource')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(auth.isAuthenticated).toBe(false)
    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('auth_user')).toBeNull()
    delete apiClient.defaults.adapter
  })
})
