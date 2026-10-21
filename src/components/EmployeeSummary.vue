<script setup lang="ts">
import { computed } from 'vue'
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

    <p v-if="loading">Updating summary...</p>
    <p v-else-if="error" class="error" role="alert">{{ error }}</p>

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
}

.error {
  color: #a22;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.summary-grid article {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.summary-grid span {
  color: #666;
}

.summary-grid strong {
  font-size: 24px;
}
</style>
