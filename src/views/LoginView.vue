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

    await router.replace(typeof redirect === 'string' ? redirect : { name: 'dashboard' })
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
  min-height: 100vh;
  place-items: center;
  padding: 28px 20px;
  background:
    radial-gradient(ellipse at 50% 0%, rgb(191 219 254 / 55%), transparent 36rem),
    linear-gradient(145deg, #f8fbff, #eef4fc);
}

.login-card {
  display: grid;
  gap: 10px;
  width: 100%;
  max-width: 420px;
  padding: clamp(26px, 6vw, 40px);
  border: 1px solid rgb(226 232 240 / 85%);
  border-radius: 22px;
  background: rgb(255 255 255 / 94%);
  box-shadow:
    0 28px 70px rgb(15 23 42 / 10%),
    0 3px 10px rgb(15 23 42 / 4%);
}

.login-card h1 {
  margin: 0;
  color: #172554;
  font-size: 1.8rem;
  letter-spacing: -0.04em;
}

.login-card > p {
  margin: 0 0 14px;
  color: #64748b;
}

.login-card label {
  margin-top: 8px;
  color: #334155;
  font-size: 0.85rem;
  font-weight: 700;
}

.login-card input {
  min-height: 46px;
  padding: 11px 13px;
  border: 1px solid #dbe3ee;
  border-radius: 10px;
  color: #1e293b;
  background: #fff;
  font: inherit;
  transition:
    border-color 140ms ease,
    box-shadow 140ms ease;
}

.login-card input:focus {
  border-color: #60a5fa;
  outline: 0;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 14%);
}

.login-card button {
  min-height: 46px;
  margin-top: 12px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 8px 18px rgb(37 99 235 / 20%);
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 140ms ease,
    filter 140ms ease;
}

.login-card button:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(0.96);
}

.login-card button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.error {
  margin: 4px 0;
  padding: 11px 12px;
  border: 1px solid #fecaca;
  border-radius: 9px;
  color: #991b1b;
  background: #fff7f7;
}
</style>
