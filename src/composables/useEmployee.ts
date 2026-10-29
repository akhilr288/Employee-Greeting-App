import { ref, readonly } from 'vue'
import { employeeService } from '@/services/employeeService'
import type { ApiEmployee, ApiEmployeePayload } from '@/types/employee'
import { getApiErrorMessage } from '@/utils/apiError'

// Module-level state: shared by every useEmployee() call.
const employees = ref<ApiEmployee[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

let latestRequestId = 0

export function useEmployee() {
  async function fetchEmployees() {
    const requestId = ++latestRequestId

    loading.value = true
    error.value = null

    try {
      const response = await employeeService.getAll()

      if (requestId !== latestRequestId) return

      employees.value = response
    } catch (err: unknown) {
      if (requestId !== latestRequestId) return
      error.value = getApiErrorMessage(err)
    } finally {
      if (requestId === latestRequestId) {
        loading.value = false
      }
    }
  }

  async function getEmployeeById(id: number) {
    error.value = null

    try {
      return await employeeService.getById(id)
    } catch (err: unknown) {
      error.value = getApiErrorMessage(err)
      throw err
    }
  }

  async function addEmployee(payload: ApiEmployeePayload) {
    error.value = null

    try {
      const employee = await employeeService.create(payload)
      employees.value = [...employees.value, employee]
      return employee
    } catch (err: unknown) {
      error.value = getApiErrorMessage(err)
      throw err
    }
  }

  async function updateEmployee(id: number, payload: ApiEmployeePayload) {
    error.value = null

    try {
      const employee = await employeeService.update(id, payload)
      employees.value = employees.value.map((current) => (current.id === id ? employee : current))
      return employee
    } catch (err: unknown) {
      error.value = getApiErrorMessage(err)
      throw err
    }
  }

  async function deleteEmployee(id: number) {
    error.value = null

    try {
      await employeeService.delete(id)

      employees.value = employees.value.filter((employee) => employee.id !== id)
    } catch (err: unknown) {
      error.value = getApiErrorMessage(err)
      throw err
    }
  }

  return {
    employees: readonly(employees),
    loading: readonly(loading),
    error: readonly(error),
    fetchEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
