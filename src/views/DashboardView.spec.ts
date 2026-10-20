import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@/stores/authStore'
import DashboardView from '@/views/DashboardView.vue'

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }))

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    useRouter: () => ({ replace }),
  }
})

describe('DashboardView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    replace.mockReset()
  })

  it('logs out and navigates to login when Logout is clicked', async () => {
    const auth = useAuthStore()
    const logout = vi.spyOn(auth, 'logout').mockResolvedValue()
    const wrapper = mount(DashboardView, {
      global: { stubs: ['RouterLink'] },
    })

    await wrapper.get('button').trigger('click')

    expect(logout).toHaveBeenCalledOnce()
    expect(replace).toHaveBeenCalledWith({ name: 'login' })
  })
})
