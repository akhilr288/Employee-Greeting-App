import { createPinia, setActivePinia } from 'pinia'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/services/apiClient'
import { useAuthStore } from '@/stores/authStore'
import App from '@/App.vue'
import router from '@/router'

const user = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN' as const,
}

let pinia: ReturnType<typeof createPinia>

describe('LoginView', () => {
  beforeEach(async () => {
    localStorage.clear()
    pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore(pinia).$patch({ token: null, user: null, loading: false })
    vi.restoreAllMocks()
  })

  it('redirects to the dashboard after successful login', async () => {
    const replace = vi.spyOn(router, 'replace')
    vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: {
        status: 'success',
        status_code: 200,
        message: 'Login successful',
        data: {
          user: {
            user_id: 'user-123',
            name: user.name,
            email: user.email,
            user_role: 'exhibitor_staff',
          },
          role: 'esa',
          access_token: 'test-token',
          token_type: 'Bearer',
        },
      },
    })

    const wrapper = mount(App, { global: { plugins: [pinia, router] } })
    await router.isReady()
    await router.replace('/login')
    expect(router.currentRoute.value.fullPath).toBe('/login')
    await wrapper.get('#email').setValue(user.email)
    await wrapper.get('#password').setValue('valid-password')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(apiClient.post).toHaveBeenCalled()
    expect(replace).toHaveBeenLastCalledWith({ name: 'dashboard' })
    await replace.mock.results[replace.mock.results.length - 1]?.value
    expect(useAuthStore().isAuthenticated).toBe(true)
    expect(router.currentRoute.value.path).toBe('/dashboard')
    expect(wrapper.get('h1').text()).toBe('Dashboard')
    wrapper.unmount()
  })

  it('displays an error when login credentials are rejected', async () => {
    vi.spyOn(apiClient, 'post').mockRejectedValue({
      isAxiosError: true,
      response: { status: 401, data: { message: 'Invalid credentials' } },
    })

    const wrapper = mount(App, { global: { plugins: [pinia, router] } })
    await router.isReady()
    await router.replace('/login')
    await wrapper.get('#email').setValue(user.email)
    await wrapper.get('#password').setValue('invalid-password')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Please sign in')
    expect(router.currentRoute.value.path).toBe('/login')
    wrapper.unmount()
  })
})
