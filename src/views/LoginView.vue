<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getApiErrorMessage } from '@/utils/apiError'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    })

    const redirect = route.query.redirect

    await router.replace(
      typeof redirect === 'string' ? redirect : { name: 'dashboard' },
    )
  } catch (error: unknown) {
    errorMessage.value = getApiErrorMessage(error)
  }
}
</script>

<template>
  <main class="login-page">
    <form class="login-card" @submit.prevent="handleLogin">
      <h1>Employee Portal</h1>
      <p>Sign in to continue.</p>

      <label for="email">Email</label>
      <input id="email" v-model.trim="email" type="email" autocomplete="username" required />

      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
      />

      <p v-if="errorMessage" class="error" role="alert">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  display: grid;
  min-height: 80vh;
  place-items: center;
  padding: 24px;
}

.login-card {
  display: grid;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  padding: 28px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.login-card h1,
.login-card p {
  margin: 0;
}

.login-card label {
  margin-top: 8px;
}

.login-card input,
.login-card button {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font: inherit;
}

.login-card button {
  margin-top: 12px;
  cursor: pointer;
}

.login-card button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.error {
  color: #a22;
}
</style>
