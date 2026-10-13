import type { AuthUser, UserRole } from '../types/auth'

export const demoUsers: Record<UserRole, AuthUser> = {
  ADMIN: {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
  },
  HR: {
    id: 2,
    name: 'HR User',
    email: 'hr@example.com',
    role: 'HR',
  },
  EMPLOYEE: {
    id: 3,
    name: 'Employee User',
    email: 'employee@example.com',
    role: 'EMPLOYEE',
  },
}

let currentUser: AuthUser | null = null

export function getDemoUsers(): AuthUser[] {
  return Object.values(demoUsers)
}

export function getUserByRole(role: UserRole): AuthUser {
  return demoUsers[role]
}

export function getCurrentUser(): AuthUser | null {
  return currentUser
}

export function setCurrentUser(user: AuthUser | null): void {
  currentUser = user
}

export function login(role: UserRole): Promise<AuthUser> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = demoUsers[role]
      currentUser = user
      resolve(user)
    }, 300)
  })
}

export function logout(): void {
  currentUser = null
}

export function isAuthenticated(user: AuthUser | null = currentUser): boolean {
  return user !== null
}

export function hasAnyRole(user: AuthUser | null = currentUser, roles: UserRole[] = []): boolean {
  return user !== null && roles.includes(user.role)
}

const authService = {
  demoUsers,
  getDemoUsers,
  getUserByRole,
  getCurrentUser,
  setCurrentUser,
  login,
  logout,
  isAuthenticated,
  hasAnyRole,
}

export default authService
