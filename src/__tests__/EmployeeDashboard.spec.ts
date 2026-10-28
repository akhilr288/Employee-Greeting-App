import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'
import router from '../router'

describe('EmployeeDashboard route', () => {
  it('renders the dashboard at /employee-dashboard', async () => {
    await router.push('/employee-dashboard')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Employee Dashboard')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Employee Overview')
  })

  it('keeps the employee directory at the root route', async () => {
    await router.push('/')

    const wrapper = mount(App, { global: { plugins: [router] } })

    expect(wrapper.get('h1').text()).toBe('Employee Directory')
  })
})
