import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { employeeService } from '@/services/employeeService'
import EmployeeManagementView from './EmployeeManagementView.vue'
import type { ApiEmployee } from '@/types/employee'

vi.mock('@/services/employeeService', () => ({
  employeeService: {
    getAll: vi.fn<typeof employeeService.getAll>(),
    getById: vi.fn<typeof employeeService.getById>(),
    create: vi.fn<typeof employeeService.create>(),
    update: vi.fn<typeof employeeService.update>(),
    delete: vi.fn<typeof employeeService.delete>(),
    patch: vi.fn<typeof employeeService.patch>(),
    getPaginated: vi.fn<typeof employeeService.getPaginated>(),
  },
}))

function createEmployee(id: number): ApiEmployee {
  return {
    id,
    name: `Employee ${id}`,
    username: `employee${id}`,
    email: `employee${id}@example.com`,
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
      name: `Company ${id}`,
      catchPhrase: 'Hello',
      bs: 'Testing',
    },
  }
}

describe('EmployeeManagementView shared employee state', () => {
  beforeEach(() => {
    vi.mocked(employeeService.getAll).mockReset()
    vi.mocked(employeeService.delete).mockReset().mockResolvedValue()
  })

  it('updates the employee list and summary after a delete', async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue([createEmployee(1), createEmployee(2)])
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const wrapper = mount(EmployeeManagementView)
    await flushPromises()

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.findAll('.summary-grid strong').map((value) => value.text())).toEqual(['2', '2'])

    await wrapper.get('tbody button').trigger('click')
    await flushPromises()

    expect(confirm).toHaveBeenCalledOnce()
    expect(employeeService.delete).toHaveBeenCalledWith(1)
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.text()).not.toContain('Employee 1')
    expect(wrapper.findAll('.summary-grid strong').map((value) => value.text())).toEqual(['1', '1'])

    wrapper.unmount()
    confirm.mockRestore()
  })

  it('paginates employee rows without changing the employee total', async () => {
    vi.mocked(employeeService.getAll).mockResolvedValue(
      Array.from({ length: 7 }, (_, index) => createEmployee(index + 1)),
    )
    const wrapper = mount(EmployeeManagementView)
    await flushPromises()

    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
    expect(wrapper.text()).toContain('Showing 1–5 of 7')
    expect(wrapper.findAll('.summary-grid strong').map((value) => value.text())).toEqual(['7', '7'])

    await wrapper.get('[aria-label="Next page"]').trigger('click')

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Showing 6–7 of 7')

    wrapper.unmount()
  })

  it('displays the useful API failure message in both consumers', async () => {
    const apiError = Object.assign(new Error('Request failed'), {
      isAxiosError: true,
      response: {
        status: 503,
        data: { message: 'Employee API unavailable' },
      },
    })
    vi.mocked(employeeService.getAll).mockRejectedValueOnce(apiError)

    const wrapper = mount(EmployeeManagementView)
    await flushPromises()

    expect(wrapper.findAll('[role="alert"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Employee API unavailable')

    wrapper.unmount()
  })
})
