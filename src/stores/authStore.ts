import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser, UserRole } from '../types/auth'
import { getUserByRole, login as loginUser, logout as logoutUser, hasAnyRole as hasRole } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  function login(role: UserRole) {
    user.value = getUserByRole(role)
    void loginUser(role).then((loggedInUser) => {
      user.value = loggedInUser
    })
  }

  function logout() {
    user.value = null
    logoutUser()
  }

  function hasAnyRole(roles: UserRole[]) {
    return hasRole(user.value, roles)
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasAnyRole,
  }
})
