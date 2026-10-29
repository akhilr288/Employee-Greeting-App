import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isReadonly } from 'vue'
import { employeeService } from '@/services/employeeService'
import type { ApiEmployee, ApiEmployeePayload } from '@/types/employee'
import { useEmployee } from './useEmployee'

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
      name: 'Acme',
      catchPhrase: 'Hello',
      bs: 'Testing',
    },
  }
}

const toPayload = ({ id: _id, ...payload }: ApiEmployee): ApiEmployeePayload => payload

describe('useEmployee', () => {
  beforeEach(async () => {
    vi.mocked(employeeService.getAll).mockReset().mockResolvedValue([])
    vi.mocked(employeeService.getById).mockReset()
    vi.mocked(employeeService.create).mockReset()
    vi.mocked(employeeService.update).mockReset()
    vi.mocked(employeeService.delete).mockReset().mockResolvedValue()
    await useEmployee().fetchEmployees()
  })

  it('exposes shared employees, loading, and error as readonly refs', () => {
    const firstConsumer = useEmployee()
    const secondConsumer = useEmployee()

    expect(firstConsumer.employees).toBe(secondConsumer.employees)
    expect(firstConsumer.loading).toBe(secondConsumer.loading)
    expect(firstConsumer.error).toBe(secondConsumer.error)
    expect(isReadonly(firstConsumer.employees)).toBe(true)
    expect(isReadonly(firstConsumer.employees.value)).toBe(true)
    expect(isReadonly(firstConsumer.loading)).toBe(true)
    expect(isReadonly(firstConsumer.error)).toBe(true)
  })

  it('sets loading while fetching and stores the returned employees', async () => {
    let resolveEmployees!: (employees: ApiEmployee[]) => void
    vi.mocked(employeeService.getAll).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveEmployees = resolve
      }),
    )

    const state = useEmployee()
    const request = state.fetchEmployees()

    expect(state.loading.value).toBe(true)

    const employees = [createEmployee(1)]
    resolveEmployees(employees)
    await request

    expect(state.employees.value).toEqual(employees)
    expect(state.loading.value).toBe(false)
    expect(state.error.value).toBeNull()
  })

  it('supports adding, updating, and deleting employees', async () => {
    const firstEmployee = createEmployee(1)
    const state = useEmployee()
    vi.mocked(employeeService.getAll).mockResolvedValueOnce([firstEmployee])
    await state.fetchEmployees()

    const secondEmployee = createEmployee(2)
    vi.mocked(employeeService.create).mockResolvedValueOnce(secondEmployee)
    await state.addEmployee(toPayload(secondEmployee))
    expect(state.employees.value).toEqual([firstEmployee, secondEmployee])

    const updatedEmployee = { ...firstEmployee, name: 'Updated Employee' }
    vi.mocked(employeeService.update).mockResolvedValueOnce(updatedEmployee)
    await state.updateEmployee(firstEmployee.id, toPayload(updatedEmployee))
    expect(state.employees.value[0]).toEqual(updatedEmployee)

    await state.deleteEmployee(secondEmployee.id)
    expect(employeeService.delete).toHaveBeenCalledWith(secondEmployee.id)
    expect(state.employees.value).toEqual([updatedEmployee])
  })

  it('stores a useful message when fetching fails', async () => {
    const apiError = Object.assign(new Error('Request failed'), {
      isAxiosError: true,
      response: {
        status: 503,
        data: { message: 'Employee API unavailable' },
      },
    })
    vi.mocked(employeeService.getAll).mockRejectedValueOnce(apiError)

    const state = useEmployee()
    await state.fetchEmployees()

    expect(state.error.value).toBe('Employee API unavailable')
    expect(state.loading.value).toBe(false)
  })
})
