import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import EmployeesView from '../views/EmployeesView.vue'
import { employeeService } from '../services/employeeService'
import type { ApiEmployee } from '../types/employee'

vi.mock('../services/employeeService', () => ({
  employeeService: {
    getAll: vi.fn(),
  },
}))

function createEmployee(id: number): ApiEmployee {
  return {
    id,
    name: `Employee ${id}`,
    email: `employee${id}@example.com`,
    username: `employee${id}`,
    address: {
      street: 'Main Street',
      suite: 'Suite 1',
      city: 'Springfield',
      zipcode: '12345',
      geo: { lat: '0', lng: '0' },
    },
    phone: '555-0100',
    website: 'example.com',
    company: {
      name: id <= 3 ? 'Acme' : 'Globex',
      catchPhrase: 'Hello',
      bs: 'Testing',
    },
  }
}

describe('EmployeesView', () => {
  beforeEach(() => {
    vi.mocked(employeeService.getAll).mockResolvedValue(
      Array.from({ length: 7 }, (_, index) => createEmployee(index + 1)),
    )
  })

  it('paginates the employee list', async () => {
    const wrapper = mount(EmployeesView, { global: { stubs: ['RouterLink'] } })
    await flushPromises()

    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
    expect(wrapper.text()).toContain('Page 1 of 2')

    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Page 2 of 2')
  })

  it('filters employees by name without regard to case', async () => {
    const wrapper = mount(EmployeesView, { global: { stubs: ['RouterLink'] } })
    await flushPromises()

    await wrapper.get('[aria-label="Next page"]').trigger('click')
    await wrapper.get('[aria-label="Search employees by name"]').setValue('eMpLoYeE 2')

    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).toContain('Employee 2')
    expect(wrapper.text()).toContain('Page 1 of 1')
  })

  it('sorts and filters employees', async () => {
    const wrapper = mount(EmployeesView, { global: { stubs: ['RouterLink'] } })
    await flushPromises()

    await wrapper.get('[aria-label="Sort by name"]').setValue('desc')
    expect(wrapper.find('tbody tr').text()).toContain('Employee 7')

    await wrapper.get('[aria-label="Filter by company"]').setValue('Acme')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.text()).toContain('Employee 3')
    expect(wrapper.text()).not.toContain('Employee 4')
  })

  it('shows a loading indicator while requesting employees', async () => {
    let resolveEmployees!: (employees: ApiEmployee[]) => void
    vi.mocked(employeeService.getAll).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveEmployees = resolve
      }),
    )

    const wrapper = mount(EmployeesView, { global: { stubs: ['RouterLink'] } })
    await nextTick()

    expect(wrapper.get('[role="status"]').text()).toContain('Loading employees...')

    resolveEmployees([createEmployee(1)])
    await flushPromises()

    expect(wrapper.find('[role="status"]').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('shows API errors and allows retrying the request', async () => {
    const apiError = Object.assign(new Error('Request failed'), {
      isAxiosError: true,
      response: {
        status: 503,
        data: { message: 'Employee API unavailable' },
      },
    })
    vi.mocked(employeeService.getAll)
      .mockRejectedValueOnce(apiError)
      .mockResolvedValueOnce([createEmployee(1)])

    const wrapper = mount(EmployeesView, { global: { stubs: ['RouterLink'] } })
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Employee API unavailable')

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })
})
