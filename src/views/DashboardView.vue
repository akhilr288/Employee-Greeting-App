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
  <main class="dashboard">
    <section class="welcome-card">
      <div>
        <p class="dashboard-eyebrow">EMPLOYEE PORTAL</p>
        <h1>Dashboard</h1>
        <p>Your people workspace, all in one place.</p>
      </div>
      <div class="dashboard-actions">
        <RouterLink to="/employees" class="employees-link">View employees</RouterLink>
        <button type="button" class="logout-button" @click="logout">Logout</button>
      </div>
    </section>

    <section class="dashboard-tip">
      <span aria-hidden="true">+</span>
      <div>
        <h2>Everything starts with your team</h2>
        <p>Browse employee profiles and keep important details close at hand.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  width: min(1100px, calc(100% - 48px));
  margin: 0 auto;
  padding: 56px 0;
}

.welcome-card {
  display: flex;
  min-height: 280px;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: clamp(28px, 6vw, 56px);
  overflow: hidden;
  border: 1px solid rgb(147 197 253 / 55%);
  border-radius: 26px;
  color: #fff;
  background:
    radial-gradient(circle at 90% 15%, rgb(147 197 253 / 28%), transparent 20rem),
    linear-gradient(125deg, #172554, #1e40af 58%, #2563eb);
  box-shadow: 0 24px 54px rgb(30 64 175 / 20%);
}

.dashboard-eyebrow {
  margin: 0 0 12px;
  color: #bfdbfe;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.welcome-card h1 {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  letter-spacing: -0.055em;
}

.welcome-card p:not(.dashboard-eyebrow) {
  margin: 12px 0 0;
  color: #dbeafe;
  font-size: 1.05rem;
}

.dashboard-actions {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 10px;
}

.employees-link,
.logout-button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 11px 18px;
  font-size: 0.9rem;
  font-weight: 700;
  transition:
    transform 140ms ease,
    background-color 140ms ease;
}

.employees-link {
  color: #1e40af;
  background: #fff;
  box-shadow: 0 8px 18px rgb(15 23 42 / 12%);
}

.employees-link:hover {
  transform: translateY(-1px);
  color: #1e3a8a;
  background: #eff6ff;
}

.logout-button {
  border: 1px solid rgb(219 234 254 / 35%);
  color: #eff6ff;
  background: rgb(255 255 255 / 8%);
  cursor: pointer;
}

.logout-button:hover {
  transform: translateY(-1px);
  background: rgb(255 255 255 / 16%);
}

.dashboard-tip {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 22px;
  padding: 22px 24px;
  border: 1px solid #e4eaf3;
  border-radius: 16px;
  background: rgb(255 255 255 / 88%);
  box-shadow: 0 10px 26px rgb(15 23 42 / 4%);
}

.dashboard-tip > span {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 12px;
  color: #1d4ed8;
  background: #eff6ff;
}

.dashboard-tip h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1rem;
}

.dashboard-tip p {
  margin: 7px 0 0;
  color: #64748b;
}

@media (max-width: 640px) {
  .dashboard {
    width: min(100% - 32px, 1100px);
    padding: 32px 0;
  }

  .welcome-card {
    align-items: flex-start;
    flex-direction: column;
    min-height: 0;
  }

  .dashboard-actions {
    width: 100%;
    flex-direction: row;
  }

  .dashboard-actions > * {
    flex: 1;
  }
}
</style>
