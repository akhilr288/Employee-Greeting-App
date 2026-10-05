import type { Employee } from '../types/employee'
import { employees } from '../constants/employeeData'

export function searchEmployees(keyword: string): Promise<Employee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const results = employees.filter((employee) => {
        return employee.name.toLowerCase().includes(normalizedKeyword)
      })
      resolve(results)
    }, 800)
  })
}
