<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  void auth.logout()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <section>
    <h1>Dashboard</h1>
    <p>Welcome to your employee portal.</p>

    <RouterLink to="/employees"> View employees </RouterLink>
    <button type="button" @click="logout">Logout</button>
  </section>
</template>
