import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser, UserRole } from '../types/auth'

const demoUsers: Record<UserRole, AuthUser> = {
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

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  function login(role: UserRole) {
    user.value = demoUsers[role]
  }

  function logout() {
    user.value = null
  }

  function hasAnyRole(roles: UserRole[]) {
    return user.value !== null && roles.includes(user.value.role)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasAnyRole,
  }
})
