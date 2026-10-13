export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
}
