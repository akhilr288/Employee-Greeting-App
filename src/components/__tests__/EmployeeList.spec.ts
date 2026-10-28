import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import EmployeeList from '@/components/EmployeeList.vue'
import { employeeService } from '@/services/employeeService'
import type { Employee } from '@/types/employee'

vi.mock('@/services/employeeService', () => ({
  employeeService: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedService = vi.mocked(employeeService)

const employees: Employee[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    department: 'Engineering',
    designation: 'Developer',
    experience: 3,
    status: 'active',
  },
  {
    id: 2,
    name: 'Sam Taylor',
    email: 'sam@example.com',
    department: 'Design',
    designation: 'Designer',
    experience: 5,
    status: 'inactive',
  },
]

describe('EmployeeList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('loads and renders employees', async () => {
    mockedService.getAll.mockResolvedValue({
      data: employees,
    } as Awaited<ReturnType<typeof employeeService.getAll>>)

    const wrapper = mount(EmployeeList)

    expect(wrapper.text()).toContain('Loading employees')

    await flushPromises()

    expect(wrapper.text()).toContain('Alex Johnson')
    expect(wrapper.text()).toContain('Sam Taylor')
    expect(mockedService.getAll).toHaveBeenCalledOnce()
  })

  it('shows an empty state when there are no employees', async () => {
    mockedService.getAll.mockResolvedValue({
      data: [],
    } as Awaited<ReturnType<typeof employeeService.getAll>>)

    const wrapper = mount(EmployeeList)

    await flushPromises()

    expect(wrapper.text()).toContain('No employees found')
  })

  it('deletes an employee after a successful API response', async () => {
    mockedService.getAll.mockResolvedValue({
      data: employees,
    } as Awaited<ReturnType<typeof employeeService.getAll>>)

    mockedService.delete.mockResolvedValue(undefined)

    const wrapper = mount(EmployeeList)

    await flushPromises()

    await wrapper.findAll('button').find((button) => button.text() === 'Delete')!.trigger('click')
    await flushPromises()

    expect(mockedService.delete).toHaveBeenCalledWith(1)
    expect(wrapper.text()).not.toContain('Alex Johnson')
    expect(wrapper.text()).toContain('Sam Taylor')
  })

  it('shows an error and offers retry when loading fails', async () => {
    mockedService.getAll.mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(EmployeeList)

    await flushPromises()

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Retry')
  })
})
