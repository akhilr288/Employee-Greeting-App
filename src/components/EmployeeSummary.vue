<script setup lang="ts">
import { computed } from 'vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import { useEmployee } from '@/composables/useEmployee'

const { employees, loading, error } = useEmployee()

const totalEmployees = computed(() => employees.value.length)
const representedCompanies = computed(
  () => new Set(employees.value.map((employee) => employee.company.name)).size,
)
</script>

<template>
  <section class="summary">
    <h2>Employee Summary</h2>

    <LoadingState v-if="loading" message="Updating summary..." />
    <ErrorState v-else-if="error" :message="error" />

    <div class="summary-grid">
      <article>
        <span>Total employees</span>
        <strong>{{ totalEmployees }}</strong>
      </article>

      <article>
        <span>Companies represented</span>
        <strong>{{ representedCompanies }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped>
.summary {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #e4eaf3;
  border-radius: 18px;
  background: rgb(255 255 255 / 90%);
  box-shadow: 0 12px 32px rgb(15 23 42 / 5%);
}

.summary h2 {
  margin: 0 0 18px;
  color: #1e293b;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.summary-grid article {
  display: grid;
  gap: 8px;
  min-height: 104px;
  align-content: center;
  padding: 18px 20px;
  border: 1px solid #e8eef7;
  border-radius: 14px;
  background: linear-gradient(135deg, #f8fbff, #f2f7ff);
}

.summary-grid span {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

.summary-grid strong {
  color: #1e40af;
  font-size: 1.9rem;
  letter-spacing: -0.04em;
}

@media (max-width: 540px) {
  .summary {
    padding: 18px;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
