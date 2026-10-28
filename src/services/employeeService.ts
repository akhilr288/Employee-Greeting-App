import type { ApiEmployee, EmployeeServiceResult } from '@/types/employee'

const endpoint = 'https://jsonplaceholder.typicode.com/users'

async function getAll(): Promise<EmployeeServiceResult> {
  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error(`Failed to load employees (HTTP ${response.status})`)
  }

  return (await response.json()) as ApiEmployee[]
}

async function deleteEmployee(id: number): Promise<void> {
  const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(`Failed to delete employee (HTTP ${response.status})`)
  }
}

export const employeeService = {
  getAll,
  delete: deleteEmployee,
}
