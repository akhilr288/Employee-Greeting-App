import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('renders the employee directory', async () => {
    await router.push('/')
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.get('h1').text()).toBe('Employee Directory')
  })
})
