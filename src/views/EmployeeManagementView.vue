<script setup lang="ts">
import EmployeeSummary from '@/components/EmployeeSummary.vue'
import EmployeeList from '@/components/EmployeeList.vue'
</script>

<template>
  <main class="employee-management">
    <header class="management-heading">
      <div>
        <p class="eyebrow">PEOPLE OPERATIONS</p>
        <h1>Employee management</h1>
        <p class="heading-copy">Keep your team information organized and up to date.</p>
      </div>
      <span class="heading-mark" aria-hidden="true">EP</span>
    </header>

    <EmployeeSummary />
    <EmployeeList />
  </main>
</template>

<style scoped>
.employee-management {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
  padding: 48px 0 64px;
}

.management-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.management-heading h1 {
  margin: 0;
  color: #172554;
  font-size: clamp(2rem, 4vw, 2.65rem);
  letter-spacing: -0.045em;
}

.eyebrow {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.heading-copy {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 1rem;
}

.heading-mark {
  display: grid;
  width: 64px;
  height: 64px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgb(147 197 253 / 55%);
  border-radius: 20px;
  color: #1d4ed8;
  background: linear-gradient(145deg, #eff6ff, #dbeafe);
  box-shadow: 0 12px 26px rgb(37 99 235 / 12%);
  font-size: 1.15rem;
  font-weight: 800;
}

@media (max-width: 640px) {
  .employee-management {
    width: min(100% - 32px, 1200px);
    padding: 32px 0 48px;
  }

  .management-heading {
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .heading-mark {
    width: 48px;
    height: 48px;
    border-radius: 15px;
  }
}
</style>
