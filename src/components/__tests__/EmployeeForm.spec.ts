import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import EmployeeForm from '@/components/EmployeeForm.vue'

describe('EmployeeForm', () => {
  it('renders all required form fields', () => {
    const wrapper = mount(EmployeeForm)

    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#department').exists()).toBe(true)
    expect(wrapper.find('#designation').exists()).toBe(true)
    expect(wrapper.find('#experience').exists()).toBe(true)
  })

  it('shows validation errors when the form is empty', async () => {
    const wrapper = mount(EmployeeForm)

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Department is required')
    expect(wrapper.text()).toContain('Designation is required')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('rejects an invalid email', async () => {
    const wrapper = mount(EmployeeForm)

    await wrapper.get('#name').setValue('Alex Johnson')
    await wrapper.get('#email').setValue('invalid-email')
    await wrapper.get('#department').setValue('Engineering')
    await wrapper.get('#designation').setValue('Developer')
    await wrapper.get('#experience').setValue('3')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Enter a valid email address')
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('emits the form payload when all fields are valid', async () => {
    const wrapper = mount(EmployeeForm)

    await wrapper.get('#name').setValue('Alex Johnson')
    await wrapper.get('#email').setValue('alex@example.com')
    await wrapper.get('#department').setValue('Engineering')
    await wrapper.get('#designation').setValue('Developer')
    await wrapper.get('#experience').setValue('3')
    await wrapper.get('#status').setValue('active')

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          department: 'Engineering',
          designation: 'Developer',
          experience: 3,
          status: 'active',
        },
      ],
    ])
  })

  it('emits cancel when Cancel is clicked', async () => {
    const wrapper = mount(EmployeeForm)

    await wrapper.get('button[type="button"]').trigger('click')

    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
