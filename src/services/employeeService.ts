import { apiClient } from './apiClient'
import type { ApiEmployee, ApiEmployeePayload } from '../types/employee'

export const employeeService = {
  async getAll(): Promise<ApiEmployee[]> {
    const response = await apiClient.get<ApiEmployee[]>('/users')
    return response.data
  },

  async getById(id: number): Promise<ApiEmployee> {
    const response = await apiClient.get<ApiEmployee>(`/users/${id}`)
    return response.data
  },

  async create(payload: ApiEmployeePayload): Promise<ApiEmployee> {
    const response = await apiClient.post<ApiEmployee>('/users', payload)
    return response.data
  },

  async update(id: number, payload: ApiEmployeePayload): Promise<ApiEmployee> {
    const response = await apiClient.put<ApiEmployee>(`/users/${id}`, payload)
    return response.data
  },

  async patch(id: number, payload: Partial<ApiEmployeePayload>): Promise<ApiEmployee> {
    const response = await apiClient.patch<ApiEmployee>(`/users/${id}`, payload)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`)
  },
}
