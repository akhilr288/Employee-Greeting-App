import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmployeeCard from '@/components/EmployeeCard.vue'
import type { Employee } from '@/types/employee'

const employee: Employee = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex@example.com',
  department: 'Engineering',
  designation: 'Senior Developer',
  experience: 8,
  status: 'active',
}

describe('EmployeeCard', () => {
  it('renders employee details from props', () => {
    const wrapper = mount(EmployeeCard, {
      props: { employee },
    })

    expect(wrapper.text()).toContain('Alex Johnson')
    expect(wrapper.text()).toContain('alex@example.com')
    expect(wrapper.text()).toContain('Engineering')
    expect(wrapper.text()).toContain('Senior Developer')
  })

  it('renders the correct status', () => {
    const wrapper = mount(EmployeeCard, {
      props: { employee },
    })

    expect(wrapper.find('.status').text()).toBe('active')
    expect(wrapper.find('.status').classes()).toContain('active')
  })

  it('emits edit with the employee when Edit is clicked', async () => {
    const wrapper = mount(EmployeeCard, {
      props: { employee },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[employee]])
  })

  it('emits the employee ID when Delete is clicked', async () => {
    const wrapper = mount(EmployeeCard, {
      props: { employee },
    })

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('delete')).toEqual([[1]])
  })
})
