<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import type { UserRole } from '../types/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

function loginAs(role: UserRole) {
  auth.login(role)

  const requestedPath = route.query.redirect
  const redirectTo =
    typeof requestedPath === 'string' &&
    requestedPath.startsWith('/') &&
    !requestedPath.startsWith('//')
      ? requestedPath
      : '/dashboard'

  void router.replace(redirectTo)
}
</script>

<template>
  <main class="login-page">
    <h1>Employee Portal</h1>
    <p>Select a demo role to test access control.</p>

    <button type="button" @click="loginAs('ADMIN')">Login as ADMIN</button>

    <button type="button" @click="loginAs('HR')">Login as HR</button>

    <button type="button" @click="loginAs('EMPLOYEE')">Login as EMPLOYEE</button>
  </main>
</template>
