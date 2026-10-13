<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const navigationItems: {
  label: string
  to: string
  roles?: UserRole[]
}[] = [
  { label: 'Dashboard', to: '/dashboard' },
  {
    label: 'Employees',
    to: '/employees',
    roles: ['ADMIN', 'HR'],
  },
  { label: 'Profile', to: '/profile' },
  {
    label: 'Settings',
    to: '/settings',
    roles: ['ADMIN'],
  },
]

const visibleItems = computed(() =>
  navigationItems.filter((item) => !item.roles || auth.hasAnyRole(item.roles)),
)

function logout() {
  auth.logout()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <aside class="sidebar">
    <h2>Employee Portal</h2>

    <nav aria-label="Main navigation">
      <RouterLink
        v-for="item in visibleItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        active-class="active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <p v-if="auth.user">Signed in as {{ auth.user.name }} ({{ auth.user.role }})</p>

    <button type="button" @click="logout">Logout</button>
  </aside>
</template>
